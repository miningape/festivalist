let zoomLevel = 4.5;
let lastClick = null;

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

            // Center map around point and zoom
            map.panTo( festival.coords );

            if ( lastClick != festival.name ) {
                zoomLevel = 4.5;
                lastClick = festival.name;
            }
            map.setZoom( zoomLevel += 0.5 );

            // Scroll down to information
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        });
    } )
}

function hideInfo() {
    document.querySelector('.info').style.display = 'none';
}

function slideSearch() {
    // Make search area active so we can see it or the other way
    document.querySelector('#search-bar').classList.toggle('active');

    // Change button to bars/close
    const btn = document.querySelector('#search-activate-btn')
    btn.classList.toggle("rotate")
    btn.classList.toggle("fa-bars");
    btn.classList.toggle("fa-times");
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }