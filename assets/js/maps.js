let zoomLevel = 5.5;
let lastClick = null;
let FestivalsJSON = null;
let map = null;
let pins = [];

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

    // Before adding pins load all festival data to show immediately
    fetch('/api/query').then( response => response.json() ).then( data => {
        // Once data is loaded we allow search filters to be used
        document.querySelector('#search-activate-btn').addEventListener( 'click', () => {
            slideSearch();
        });

        let filterBTNs = document.querySelectorAll('.filterer');
        filterBTNs.forEach( btn => {
            btn.addEventListener("click", () => {
                btn.classList.toggle("btn-light");
                btn.classList.toggle("btn-warning");
                filter( btn.dataset.type, btn.dataset.filter, data => { 
                    // Clear pins on map
                    pins.forEach( pin => {
                        pin.setMap(null);
                    } );

                    pins = [];

                    addPins( data ) 
                } );
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
