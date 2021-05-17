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
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "weight": "0.77"
                    },
                    {
                        "color": "#ffa600"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": "4"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
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
        addPins( data );
    } );
}

function addPins( pinArray ) {
    const info = document.querySelector(".info");

    pinArray.forEach( festival => {
        let icon;

        switch ( true ) {
            case festival.TYPE.includes("MUSIC"):
                icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                break;
            
            case festival.TYPE.includes("FILM"):
                icon = 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
                break;

            default: 
                icon = null;
        }

        console.log(icon)

        const marker = new google.maps.Marker( {
            position: festival.coords,
            title: festival.name,
            map: map,
            icon: icon,
        } );

        pins.push(marker);

        marker.addListener( "click", () => {
            // On click we change the info in the info bar
            document.querySelector("#festival-name").innerHTML      = festival.description.name;
            document.querySelector("#festival-type").innerHTML      = 'Type: '      + festival.description.type;
            document.querySelector("#festival-location").innerHTML  = 'Location: '  + festival.description.location;
            document.querySelector("#festival-lineup").innerHTML    = 'Lineup: '    + festival.description.lineup;
            document.querySelector("#festival-price").innerHTML     = 'Price: '     + festival.description.price;
            
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


// This function makes the search filters work, (i.e. makes chooses which festivals to display based on the buttons pressed)
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

            // If this category is not being used, we just allow all festivals to go through
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