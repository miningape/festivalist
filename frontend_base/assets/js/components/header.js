class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="header container ">
                <div class="row d-flex justify-content-between">
                    <div class="col d-flex flex-row mt-2">
                        <i class="fas fa-bars icon-custom change-to-list-view"></i>
                    </div>

                    <div class="col  text-center">
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

customElements.define('header-component', Header);