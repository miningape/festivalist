let zoomLevel = 5.5;
let lastClick = null;
let map = null;
let pins = [];

let filter_set = {};

// Useless function called on start for testing
main = () => {
    console.log("Testing")

    let filterBTNs = document.querySelectorAll('.filterer');
    filterBTNs.forEach( btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("btn-light");
            btn.classList.toggle("btn-warning");
            filter( btn.dataset.type, btn.dataset.filter );
        });
    });
}

window.onload = ()=>{main()};

/**
 * Initializes the map on the screen
 * 
 * called through the callback= property on the script element that includes the maps api
 */
function initMap() {
    map = new google.maps.Map(document.querySelector("#map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2.8,
    });

    addPins( FestivalsJSON.festival_list );
}

function addPins( pinArray ) {
    console.log(pinArray)
    const info = document.querySelector(".info");

    pinArray.forEach( festival => {
        const marker = new google.maps.Marker( {
            position: festival.coords,
            title: festival.name,
            map: map,
        } );

        pins.push(marker);

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
                zoomLevel = 5.5;
                lastClick = festival.name;
            }
            map.setZoom( zoomLevel += 0.5 );

            // Scroll down to information
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        });
    } );
}

function hideInfo() {
    // TODO: https://codeburst.io/the-off-click-7cbc08bb3df5
    document.querySelector('.info').style.display = 'none';

    if ( map ) {
        map.setZoom(2.8);
        map.panTo( {lat: 0, lng: 0} );
    }
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

function filter(filterType, filterValue) {
    // If this type if filter is present
    if ( filter_set[filterType] ) {
        // Toggle 1 or 0 for whether this filter is applied or not
        // If it doesnt exist coalesc to 1
        filter_set[filterType][filterValue] = 1 - (filter_set[filterType][filterValue] || 0);
    // If this type of filter isnt present, create it and try again
    } else {
        filter_set[filterType] = {};
        filter(filterType, filterValue);
    }
    

    console.log(filter_set);
    pins.forEach( pin => {
        pin.setMap(null);
    } );

    pins = [];

    // Only filters by country right now

    const filteredFestivals = FestivalsJSON.festival_list.filter( festival => festival.location.includes(filterValue) );
    addPins( filteredFestivals );
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }