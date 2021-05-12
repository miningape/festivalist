// Basically just the first example from here:
// https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
const express = require('express');
const app = express();
const PORT = 3000;


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
            
            /* SEARCH FILTER STUFF - MUST ALL BE CAPS */
            LOCATION: ["EUROPE"],

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
            coords: {
                lat: 40.786900,
                lng: -119.207248
            }
        }
    ],
};

/* Kinda Like Settings For The Server */
// Static HTML & CSS files, served on the '/assets' route
app.use( '/assets', express.static(__dirname + '/assets') );

// Set view engine to EJS (just allows for a shortcut in the code)
app.set('view engine', 'ejs');


/* URIs the User Can Access */
app.get('/', (req, res) => {
    res.render('primary');
})

app.get('/list', (req, res) => {
    res.render('secondary');
})

app.get('/api/festival-list', (req, res) => {
    res.json( DATABASE );
})

/* Start the server */
app.listen( PORT, () => {
    console.log('Hosted On: localhost:3000 or 127.0.0.1:3000')
})