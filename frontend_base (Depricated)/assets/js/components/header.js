/*
    To change the header change the string literal 
        in the function getHTML(page) 
 */

const PRIMARY_PAGE = "primary.html";
const SECONDARY_PAGE = "secondary.html";

function getOtherPage(page) {
    switch(page) {
        case PRIMARY_PAGE:
            return SECONDARY_PAGE;
        case SECONDARY_PAGE:
            return PRIMARY_PAGE;
    }
}

function getIcon(page) {
    switch(page) {
        case PRIMARY_PAGE:
            return "fa-bars";
        case SECONDARY_PAGE:
            return "fa-map-marker-alt";
    }
}

function getHTML(page) {
    return `
        <div class="header container ">
            <div class="row d-flex justify-content-between">
                <div class="col d-flex flex-row mt-2">
                    <a href="${getOtherPage(page)}" class="secondary-color">
                        <i class="fas ${getIcon(page)} icon-custom"></i>
                    </a>
                </div>

                <div class="col text-center">
                    <button onclick="topFunction()" id="go-to-top-button" class="border px-3 pb-1 border-top-0 border-5 border-custom bg-dark secondary-color"> Festivalist </h1> 
                </div>  

                <div class="col d-flex flex-row-reverse mt-2">
                    <i class="fas fa-search icon-custom search"></i>
                </div>
            </div>
        </div>
    `;
}
class PrimaryHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = getHTML(PRIMARY_PAGE);
    }
}

class SecondaryHeader extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.innerHTML = getHTML(SECONDARY_PAGE);
    }
}

customElements.define('primary-header-component', PrimaryHeader);
customElements.define('secondary-header-component', SecondaryHeader);