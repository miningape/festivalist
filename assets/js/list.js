function list( festivalArray ) {
    let elem = document.querySelector('#list-container');
    const info = document.querySelector(".info");


    elem.innerHTML = "";

    
    
    festivalArray.forEach( festival => {
        

        //elem.innerHTML += `<div class="col hoverboarder"><h1 class="display-6">${festival.description.name} <p class="lead"> - ${festival.TYPE[0]} </p> </h1></div>`
    
        let col = document.createElement('div');
        let text = document.createElement('p');
        let head = document.createElement('h1');

        col.classList.add('col', 'hoverboarder');
        head.classList.add('display-6', 'pt-5');
        text.classList.add('lead');

        head.innerHTML = festival.description.name;
        text.innerHTML = " - " + festival.TYPE[0];

        col.addEventListener('click', () => {
            // On click we change the info in the info bar
            document.querySelector("#festival-name").innerHTML      = festival.description.name;
            document.querySelector("#festival-type").innerHTML      = 'Type: '      + festival.description.type;
            document.querySelector("#festival-location").innerHTML  = 'Location: '  + festival.description.location;
            document.querySelector("#festival-lineup").innerHTML    = 'Lineup: '    + festival.description.lineup;
            //document.querySelector("#festival-price").innerHTML     = 'Price: '     + festival.description.price;
            
            // Change the CSS of the info area so we can see it
            info.style.display = 'block';

            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        });

        head.appendChild(text);
        col.appendChild(head);
        elem.appendChild(col)

    } ) 
} 

// "main" function called once the page is loaded
const main = () => {
    console.log("Testing")

    // Before adding festivals load all festival data to show immediately
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
                    console.log("callback")
                    list(data)
                } );
            });
        });

        // Finally add the festivals
        list(data)
    } );
}



window.onload = ()=>{main()};