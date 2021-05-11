// Useless function called on start for testing
(main = () => {
    console.log("Testing")
    
})()

/**
 * Initializes the map on the screen
 * 
 * called through the callback= property on the script element that includes the maps api
 */
function initMap() {
    const info = document.querySelector(".info");

    const map = new google.maps.Map(document.querySelector("#map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2.7,
    });

    FestivalsJSON.festival_list.forEach( festival => {
        const marker = new google.maps.Marker( {
            position: festival.coords,
            title: festival.name,
            map: map,
        } );

        marker.addListener( "click", () => {
            // On click we change the info in the info bar
            document.querySelector("#festival-name").innerHTML      = festival.name;
            document.querySelector("#festival-type").innerHTML      = 'Type: '      + festival.type;
            document.querySelector("#festival-location").innerHTML  = 'Location: '  + festival.locationDescription;
            document.querySelector("#festival-lineup").innerHTML    = 'Lineup: '    + festival.lineup;
            document.querySelector("#festival-price").innerHTML     = 'Price: '     + festival.price;
            
            // Change the CSS of the info area so we can see it
            info.style.display = 'block';
        });
    } )
}

function hideInfo() {
    document.querySelector('.info').style.display = 'none';
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }