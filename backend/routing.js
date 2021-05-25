const express = require('express');
const mongoose = require('mongoose');

// Import our schemas and make model
const { festivalSchema } = require('./shemas');
const Festival = mongoose.model('festival', festivalSchema, 'festivals');

// Set up router, very similar to app
const router = express.Router();


/* Adding URI to middleware router to split code up and make it easier to read */

// Index redirects to /map (no need to use next, as this is the last layer of middleware so it can end the response with .redirect)
router.get('/', (req, res) => {
    res.redirect('/map');
});

// Renders our map page
router.get('/map', (req, res) => {
    res.render('primary');
});

// Renders our list page
router.get('/list', (req, res) => {
    res.render('secondary');
});

// Performs query based on query params to this URL, returns result of query/error
router.get('/api/query', (req, res) => {
    let error = [];

    // Build query based on queryable fields in the database
    const query = Object.keys( req.query ).reduce( (acc, cur) => {
        if (["LOCATION", "TYPE", "PRICE"].includes(cur.toUpperCase())) {
            acc[cur.toUpperCase()] = {$in: typeof req.query[cur] == "object" ? req.query[cur] : [req.query[cur]]}; 
        } else {
            error.push(cur);
        }
        return acc;
    }, {} )

    // Do the query
    Festival.find( query, (err, array) => {
        if (error.length == 0 && err == null) {
            // Return just info if there are no problems
            res.json( array );
        } else {
            // Return Error messages if there was a problem with search params
            res.json(error.reduce( (acc, cur) => {acc[cur] = "Invalid Search Parameter"; return acc}, {ERROR: "PROBLEM WITH QUERY", MongoDBError: err, RESULT_IGNORED_PROBLEMS: array} ));
        }
        
    } )
});

// Make it so the router for all these paths can be used
module.exports = router;