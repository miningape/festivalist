(main = () => {
    console.log("Testing")

})()

/**
 * Initializes the map on the screen
 * 
 * called through the callback= property on the script element that includes the maps api
 */
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 3,
    });

    const roskildeFestival = new google.maps.Marker( {
        position: { lat: 55.616236, lng: 12.079475 },
        title: "jeff",
        map: map,
    } );

    roskildeFestival.addListener("click", () => {
        console.log("Roskilde Festival Was Clicked")
    })
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }