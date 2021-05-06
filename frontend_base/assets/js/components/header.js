class PrimaryHeader extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.innerHTML = `
            <div class="header container ">
                <div class="row d-flex justify-content-between">
                    <div class="col d-flex flex-row mt-2">
                        <a href="secondary.html" class="secondary-color">
                            <i class="fas fa-bars icon-custom change-to-list-view"></i>
                        </a>
                    </div>

                    <div class="col text-center">
                        <h1 class="border px-3 pb-1 border-top-0 border-5 border-custom bg-dark"> Festivalist </h1> 
                    </div>  

                    <div class="col d-flex flex-row-reverse mt-2">
                        <i class="fas fa-search icon-custom search"></i>
                    </div>
                </div>
            </div>
        `;
    }
}

class SecondaryHeader extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.innerHTML = `
            <div class="header container ">
                <div class="row d-flex justify-content-between">
                    <div class="col d-flex flex-row mt-2">
                        <a href="primary.html" class="secondary-color">
                            <i class="fas fa-map-marker-alt icon-custom change-to-map-view"></i>
                        </a>
                    </div>

                    <div class="col text-center">
                        <h1 class="border px-3 pb-1 border-top-0 border-5 border-custom bg-dark"> Festivalist </h1> 
                    </div>  

                    <div class="col d-flex flex-row-reverse mt-2">
                        <i class="fas fa-search icon-custom search"></i>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('primary-header-component', PrimaryHeader);
customElements.define('secondary-header-component', SecondaryHeader);