export class NotFound extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.html()


  }

  html() {
    return `
        <style>
          h1 {
              color: #999ba5;
              font-size: xxx-large;
          }
          :host {
            display: flex;
            flex-flow: column;
            width: 100%;
            height: 100vh;
            justify-content: center;
            margin-top: 40px;
            align-items: center;
          }
          * > div {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
          }
        </style>
        <div class="">
        <h1>$PAGE NOT FOUND 404$</h1>
        </div>
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-not-found', NotFound);
