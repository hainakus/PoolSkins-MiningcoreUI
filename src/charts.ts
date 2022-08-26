export class Chart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.html()
  }

  html() {
    return `
        <style>
         
        </style>
        <h3>HELLOO</h3>
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-chart', Chart);
