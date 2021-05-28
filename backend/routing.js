const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { festivalSchema } = require('./shemas');
const Festival = mongoose.model('festival', festivalSchema, 'festivals');

router.get('/', (req, res) => {
    res.redirect('/map');
});

router.get('/map', (req, res) => {
    res.render('primary');
});

router.get('/map-test', (req, res) => {
    res.sendFile(__dirname + '/testing/primary.html');
});

router.get('/list', (req, res) => {
    res.render('secondary');
});

router.get('/api/query', (req, res) => {
    let error = [];

    const query = Object.keys( req.query ).reduce( (acc, cur) => {
        if ( ["LOCATION", "TYPE", "PRICE"].includes( cur.toUpperCase() ) ) {
            acc[cur.toUpperCase()] = { $in: typeof req.query[cur] == 'object' ? req.query[cur] : [req.query[cur]] };
        } else {
            error.push(cur);
        }
        return acc;
    }, {} );

    Festival.find( query, (err, array) => {
        if ( error.length == 0 && err == null ) {
            res.json(array);
        } else {
            res.json(
                {"Error": {"Invalid Queries": error, "Retrieval Error": err},
                    "response": array}
            );
        }
    })
});

module.exports = router;