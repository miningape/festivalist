const FestivalsJSON = {
    list: [
        { 
            name: "Roskilde Festival",
            coords: {
                lat: 55.616236,
                lng: 12.079475
            }
        },
        { 
            name: "Burning Man",
            coords: {
                lat: 40.786900,
                lng: -119.207248
            }
        }
    ],
};

(main = () => {
    console.log("Testing")

})()

/**
 * Initializes the map on the screen
 * 
 * called through the callback= property on the script element that includes the maps api
 */
function initMap() {
    const map = new google.maps.Map(document.querySelector("#map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2.7,
    });

    FestivalsJSON.list.forEach( festival => {
        const marker = new google.maps.Marker( {
            position: festival.coords,
            title: festival.name,
            map: map,
        } );

        marker.addListener( "click", () => {
            document.querySelector("#festival-name").innerHTML = festival.name;
        });
    } )
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }