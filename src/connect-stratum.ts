export class ConnectStratum extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.html()


  }
  renderFiro() {
    return ` <pre><h3>T-REX</h3>
        <code>
          ./t-rex -a FiroPow -o stratum+tcp://neox-poolin.ml:3008 -u WALLET.WORKERNAME -p YourPassword
        </code>
        </pre>
         <pre><h3>G-Miner</h3>
        <code>
         ./miner -a FiroPow -s neox-poolin.ml:3008 -u WALLET.WORKERNAME -p YourPassword
        </code>
        </pre>`
  }
  renderNeox() {
    return ` <pre><h3>T-REX</h3>
        <code>
          ./t-rex -a kawpow -o stratum+tcp://neox-poolin.ml:3305 -u WALLET.WORKERNAME -p YourPassword
        </code>
        </pre>
         <pre><h3>G-Miner</h3>
        <code>
         ./miner -a kawpow -s neox-poolin.ml:3305 -u WALLET.WORKERNAME -p YourPassword
        </code>
        </pre>`
  }
  html() {
    return `
        <style>
          h3,h1, code {
              color: #999ba5;
              font-size: larger;
          }
          :host {
            margin-top: 40px;
          }
          * > div {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
          }
        </style>
        <div class="">
        <h1>STRATUM CONNECT FOR ${window.location.pathname === '/' ? 'NEOX': 'FIRO'}</h1>
            ${!window.location.pathname.includes('firo') ? this.renderNeox() : this.renderFiro() }
        </div>
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-connect', ConnectStratum);
