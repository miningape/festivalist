class Info extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="info container secondary-color">
                <h3 id="festival-name">
                    Festival Title:
                </h3>
                <p>
                    Type: genre
                </p>
                <p>
                    Location
                </p>
                <p>
                    Lineup
                </p>
                <p>
                    Ticket Price
                </p>
            </div>
        `;
    }
}

customElements.define('info-component', Info);