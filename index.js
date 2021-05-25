/* IMPORTING AND GETTING ENVIRONMENT VARIABLES */
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet')

// Create server app
const app = express();

// Import our routes
const routes = require('./backend/routing');

// Set the port we listen on, either the Heroku defaults, or 3000 if on local computer
const PORT = process.env.PORT || 3000; 

// Set node to production for speed
process.env.NODE_ENV = 'production';

/* --------- only works when running on heroku, or if you have the uri.json file ----------- */
// Import environment variables that are hidden, to safely connect to database
let VARS;
try {
    VARS = require('./backend/uri.json');
} catch( e ) {
    VARS = process.env;
}



/* SERVER ROUTING */

// Set view engine to EJS (just allows for a shortcut in the code)
app.set('view engine', 'ejs');

// Compress all routes
app.use(compression);

// Protects from well known header vulnerabilities
app.use(helmet)

// Use the routes defined in /backend/routing.js
app.use( '/', routes );

// Static HTML & CSS files, served on the '/assets' route
app.use( '/assets', express.static(__dirname + '/assets') );

// Every other route is an error
app.use( (req, res) => {
    res.status(404);    

    if ( req.accepts('html') ) {
        res.render('404', {URL: req.url})
    }

    if ( req.accepts('json') ) {
        res.json({"error": "404: not found", "message": "couldn't " + req.method + " " + req.url})
    }
    
    res.type('txt').send(`URL Not Found: ${ req.url }`);
} );



/* CONNECTING TO DATABASE AND STARTING SERVER */

// Format a string that is the database url
const DBURI = `mongodb+srv://${VARS.project}:${VARS.password}@${VARS.cluster}.xlu6x.mongodb.net/${VARS.database}?retryWrites=true&w=majority`;

// Actually make connection to the database then save it in the database
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check for any errors
db.on('error', console.error.bind(console, 'connection error:'))

// Once the db is open we can execute code
db.on('open', () => {
    console.log("Connected to DataBase successfully");

    
    /* Start the server */
    app.listen( PORT, () => {
        console.log('Hosted On: localhost:3000 or 127.0.0.1:3000, or heroku:80')
    })
})









/**  ------------------------------ Every thing in the comment is uneeded code but shows db, as well as how we uploaded it to cloud --------------------------------------------------
    // Code that pushes local DB to the cloud
    // Create document              Model Name  Schema Used     Collection Name
    const Festival = mongoose.model('festival', festivalSchema, 'festivals');

    Festival.insertMany( DATABASE.festival_list.map( (festival) => {
        return {
            description: {
                name: festival.name,
                type: festival.type,
                location: festival.locationDescription,
                lineup: festival.lineup,
                price: festival.price
            },
            LOCATION: festival.LOCATION,
            TYPE: festival.TYPE,
            coords: festival.coords
        }
    } ), (err) => {
        console.log(err);
    } )

    // Example of what our database could look like, its just JSON stored on another secure location
const DATABASE = {
    festival_list: [
        { 
            // info that appears in the info area
            name: "Roskilde Festival",
            type: "Music Festival / Pop",
            locationDescription: "An unused farm in Roskilde, Denmark",
            lineup: "Kendrick Lamar, Tyler the Creator",
            price: "DKK 69",
            
            // SEARCH FILTER STUFF - MUST ALL BE CAPS 
            LOCATION: ["EUROPE"],
            TYPE: ["MUSIC"],

            // coords is the location of the pin on the map
            coords: {
                lat: 55.616236,
                lng: 12.079475
            }
        },
        {
            name: "Coachella",
            type: "Music/Art Festival",
            locationDescription: "Empire Polo Club in Indio, California",
            lineup: "To Be Announced, Rex Orange County",
            price: "USD 300",

            LOCATION: ["USA", "AMERICAS"],
            TYPE: ["MUSIC"],

            coords: {
                lat: 33.694756, 
                lng: -116.152558
            }
        },
        {
            name: "Tomorrowland",
            type: "Music Festival / Electronic",
            locationDescription: "De Schorre Recreation Ground, Boom, Belgium",
            lineup: "Billie Eilish, Lewis Copaldi, Marchmello, Camila Cabelo, Stormzy, Post Malone",
            price: "EUR 69",

            LOCATION: ["EUROPE"],
            TYPE: ["MUSIC"],

            coords: {
                lat: 51.091666, 
                lng: 4.379873
            }
        },
        {
            name: "All Points East",
            type: "Music Festival / Electronic, Pop",
            locationDescription: "Victoria Park, London, England",
            lineup: "Fals, Jamie XX, Jorja Smith",
            price: "GBP 69",

            LOCATION: ["EUROPE"],
            TYPE: ["MUSIC"],

            coords: {
                lat: 51.536390, 
                lng: -0.039803
            }
        },
        { 
            name: "Burning Man",
            type: "Music Festival / Rock",
            locationDescription: "Nevada, USA",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["USA", "AMERICAS"],
            TYPE: ["MUSIC"],

            coords: {
                lat: 40.786900,
                lng: -119.207248
            }
        },
        { 
            name: "Venice International Film Festival",
            type: "Film Festival",
            locationDescription: " Palazzo del Cinema di Venezia, Venice Lido, Italy",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: { 
                lat: 45.405590,
                lng: 12.367233
            }
        },
        { 
            name: "The Cannes Film Festival",
            type: "Film Festival",
            locationDescription: "Palais des Festivals et des Congrès, Cannes, France",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: {  
                lat: 43.551256,
                lng: 7.017426
            }
        },
        { 
            name: "Taormina Film Fest",
            type: "Film Festival",
            locationDescription: "Teatro Antico di Taormina1 Via del Teatro Greco, Taormina, Sicily, Italy",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: {   
                lat: 37.852265,
                lng: 15.292006
            }
        },
        { 
            name: "Berlin International Film Festival",
            type: "Film Festival",
            locationDescription: "Potsdamer Straße 5, Berlin, Germany",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: {    
                lat: 52.508496,
                lng: 13.374223
            }
        },
        { 
            name: "Edinburgh international film festival (EIFF)",
            type: "Film Festival",
            locationDescription: "EH3 8EX, Edinburgh, Scotland",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: {     
                lat: 55.945743,
                lng: -3.208144
            }
        },
        { 
            name: "Locarno Film Festival",
            type: "Film Festival",
            locationDescription: "Via Franchino Rusca 1, Locarno, Switzerland",
            lineup: "Jeff",
            price: "USD 69",

            LOCATION: ["EUROPE"],
            TYPE: ["FILM"],

            coords: {      
                lat: 46.168250,
                lng: 8.795022
            }
        },
        { 
            name: "Hong Kong International Film Festival (HKIFF)",
            type: "Film Festival",
            locationDescription: "Hong Kong Cultural Centre, L5, Auditoria Building, 10 Salisbury Rd, Tsim Sha Tsui, Hong Kong, China",
            lineup: "Jeff",
            price: "HKD 69",

            LOCATION: ["ASIA"],
            TYPE: ["FILM"],

            coords: {       
                lat: 22.294525,
                lng: 114.170034
            }
        },
        { 
            name: "Melbourne International Film Festival (MIFF)",
            type: "Film Festival",
            locationDescription: "Block Court, 290 Collins St, Melbourne, Australia",
            lineup: "Jeff",
            price: "HKD 69",

            LOCATION: ["OTHER"],
            TYPE: ["FILM"],

            coords: {       
                lat: -37.815939,
                lng: 144.964672
            }
        },
        { 
            name: "Toronto International Film Festival (TIFF)",
            type: "Film Festival",
            locationDescription: "350 King St W, Toronto, Ontario, Canada",
            lineup: "Jeff",
            price: "HKD 69",

            LOCATION: ["USA"],
            TYPE: ["FILM"],

            coords: {       
                lat: 43.646494,
                lng: -79.390304
            }
        },
        { 
            name: "Sundance Film Festival",
            type: "Film Festival",
            locationDescription: "Sundance Resort, Salt Lake City, Utah, United States",
            lineup: "Jeff", 
            price: "HKD 69",

            LOCATION: ["USA"],
            TYPE: ["FILM"],

            coords: {        
                lat: 40.393455, 
                lng: -111.588573
            }
        },
        { 
            name: "TriBeCa Film Festival",
            type: "Film Festival",
            locationDescription: "The Battery, New York , New York, United States",
            lineup: "Jeff", 
            price: "HKD 69",

            LOCATION: ["USA"],
            TYPE: ["FILM"],

            coords: {        
                lat: 40.703446,
                lng: -74.016257
            }
        },
    ],
};


app.get('/api/docs', (req, res) => {
    res.send("Nothing here yet.")
})

 */
