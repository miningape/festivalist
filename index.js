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

            // coords is the location of the pin on the map
            coords: {
                lat: 55.616236,
                lng: 12.079475
            }
        },
        { 
            name: "Burning Man",
            type: "Music Festival / Rock",
            locationDescription: "Nevada, USA",
            lineup: "Jeff",
            price: "USD 69",
            coords: {
                lat: 40.786900,
                lng: -119.207248
            }
        }
    ],
};

// Static HTML & CSS files, served on the '/assets' route
app.use( '/assets', express.static(__dirname + '/assets') );

// Set view engine to EJS (just allows for a shortcut in the code)
app.set('view engine', 'ejs');

// First route to the '/' uri
app.get('/', (req, res) => {
    res.render('primary', {DATABASE: DATABASE});
})

app.get('/list', (req, res) => {
    res.render('secondary');
})


app.listen( PORT, () => {
    console.log('Hosted On: localhost:3000 or 127.0.0.1:3000')
})