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
      
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-chart', Chart);
