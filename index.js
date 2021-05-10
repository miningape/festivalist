const express = require('express');
const app = express();

const PORT = 3000;

// Static HTML & CSS files, served on the '/assets' route
app.use( '/assets', express.static(__dirname + '/frontend_base/assets') );

// First route to the '/' uri
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/frontend_base/primary.html');
})

app.listen( PORT, () => {
    console.log('Hosted On: localhost:3000 or 127.0.0.1:3000')
})