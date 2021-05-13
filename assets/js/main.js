let zoomLevel = 5.5;
let lastClick = null;
let FestivalsJSON = null;
let map = null;
let pins = [];

let filter_set = {};

// "main" function called on start
const main = () => {
    console.log("Testing")
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
        minZoom: 2.8,
    });

    //  map.setOptions({maxZoom:/*For example*/5});

    // Before adding pins load our data
    fetch('/api/festival-list').then( response => response.json() ).then( data => {
        // Save data in global
        FestivalsJSON = data;
        
        // Once data is loaded we allow search filters to be used
        document.querySelector('#search-activate-btn').addEventListener( 'click', () => {
            slideSearch();
        });

        let filterBTNs = document.querySelectorAll('.filterer');
        filterBTNs.forEach( btn => {
            btn.addEventListener("click", () => {
                btn.classList.toggle("btn-light");
                btn.classList.toggle("btn-warning");
                filter( btn.dataset.type, btn.dataset.filter );
            });
        });

        // Finally add the pins to the map
        addPins( FestivalsJSON.festival_list );
    } );
}

function addPins( pinArray ) {
    const info = document.querySelector(".info");

    pinArray.forEach( festival => {
        let icon;

        switch ( festival.TYPE ) {
            case "MUSIC":
                icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                break;
            
            case "FILM":
                icon = 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
                break;

            default: 
                icon = null;
        }

        const marker = new google.maps.Marker( {
            position: festival.coords,
            title: festival.name,
            map: map,
            icon: icon,
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
        map.setCenter( {lat: 0, lng: 0} );
        map.setZoom(2.8);
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
        return filter(filterType, filterValue);
    }

    console.log(filter_set)

    // Clear pins on game
    pins.forEach( pin => {
        pin.setMap(null);
    } );

    pins = [];

    // See which categories are actually pressed
    let selectObj = {};
    Object.keys( filter_set ).forEach( type_key => {
        let noneSelected = true;

        Object.keys( filter_set[type_key] ).forEach( specific_key => {
            if ( !!filter_set[type_key][specific_key] ) noneSelected = false;
        } )

        if ( !noneSelected ) selectObj[type_key] = false;
        else selectObj[type_key] = true;
    } )

    // Check if none of the buttons are pressed
    let noneSelected = Object.keys(selectObj).reduce( (acc, cur) => {
        acc = acc && selectObj[cur];
    }, true )

    // Actual Filtering
    const filteredFestivals = FestivalsJSON.festival_list.filter( festival => {
        let returnFlag = true;

        // forEach can be optimised to for()
        Object.keys( filter_set ).forEach( type_key => {
            let sameFlag = false;

            if ( !selectObj[type_key] ) {
                Object.keys( filter_set[type_key] ).forEach( specific_key => {
                    if ( filter_set[type_key][specific_key] == 1 && festival[type_key].includes( specific_key ) ) sameFlag = true;
                } )
            } else { sameFlag = true; }

            returnFlag = returnFlag && sameFlag;
        } )
        
        return returnFlag;
    } );

    

    // If nothing is selected display all of the pins otherwise show the filtered ones
    if (noneSelected == true) addPins(FestivalsJSON.festival_list);
    else addPins( filteredFestivals );
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }