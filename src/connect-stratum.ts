import { PoolService } from "./poolService";
import { store } from "./ws.service";
import { tap } from "rxjs";
import { _formatter } from "./index";
import _ from "lodash";

export class ConnectStratum extends HTMLElement {
  private _top10: any = [];
  constructor() {
    super();
    this.attachShadow({mode: 'open'})

    this.shadowRoot.innerHTML = this.html()
    const htmlContainer = this.shadowRoot.getElementById('minersContainer');
    store.query.select().pipe(tap( data => {
      console.log(data)
      this.topMiners = _.cloneDeep(data.pool?.kaspa?.topMiners)
      this.topMiners = this.topMiners.filter( m => {
        return m.hashrate > 0
      })
      console.log('top', this.topMiners)
      htmlContainer.innerHTML = ''
      const topMinersHTML = `
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Miner Address</th>
        <th>Hashrate</th>
        <th>Reward</th>
      </tr>
    </thead>
    <tbody>
       ${this.topMiners?.sort((a,b) => b.hashrate - a.hashrate).map( (m, i) => `
       <tr>
        <td>${i}</td>
        <td><a href="/wallet/${m.miner}"> ${m.miner}</a></td>
        <td>${_formatter(m.hashrate, 2, 'H/s')}</td>
        <td>0.5 BTC</td>
      </tr>
      
      `).join('')}
    </tbody>
  </table>
`;
      htmlContainer.innerHTML = topMinersHTML;
    })).subscribe()
  }
  get topMiners() {
    return this._top10
  }

  set topMiners(value:any[]) {
    this._top10 = value
  }
  renderFiro() {
    return `
  <style>
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    th {
    color: #333333;
      background-color: #f2f2f2;
    }
     a{
            text-decoration:none;
        }
        a:-webkit-any-link {
            color: #FFF;
         }
  </style>
      <h2>Top 10 Miners</h2>
        <div id="minersContainer"></div>
     `
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
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
          }
          * > div {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
          }
        </style>
        <div class="">
        <h1>STRATUM CONNECT FOR ${ PoolService.getapi().toLowerCase().includes('nexa1') ? 'DOGETHER': 'DOGETHER'}</h1>
            ${ PoolService.getapi().toLowerCase().includes('nexa1') ? this.renderFiro() : this.renderFiro() }
        </div>
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-connect', ConnectStratum);
