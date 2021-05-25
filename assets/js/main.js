let filter_set = {};

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


// This function makes the search filters work on the map
function filter(filterType, filterValue, callback) {
    console.log(callback)
    // If this type if filter is present        
    if ( filter_set[filterType] ) {
        // Toggle 1 or 0 for whether this filter is applied or not
        // If it doesnt exist coalesc to 1
        filter_set[filterType][filterValue] = 1 - (filter_set[filterType][filterValue] || 0);
    // If this type of filter isnt present, create it and try again
    } else {
        filter_set[filterType] = {};
        return filter(filterType, filterValue, callback);
    }

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

    // Only keep categories that are selected
    let query = "?";
    Object.keys( selectObj ).forEach( type_key => {
        Object.keys( filter_set[type_key] ).forEach( var_key => {
            if ( !!filter_set[type_key][var_key] ) {
                query += type_key + "=" + var_key + "&";
            }
        });
    } )

    console.log(query)

    /*
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
    */

    fetch('/api/query' + query).then( response => response.json() ).then( data => {
        callback(data);
    } );
}


// Scrolls to top on call
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }