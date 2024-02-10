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
        <td>${m.miner}</td>
        <td>${_formatter(m.hashrate, 2, 'H/s')}</td>
        <td>-</td>
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
  :host {
    padding: 0px;
  top: 40px;
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    display: flex;
    gap: 20px;
    flex-direction: column;
}
    table {
      border-collapse: collapse;
      width: 100%;
     
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    th {
    color: #ffffff;
      background-color: rgba(242,242,242,0);
    }
  </style>
      <h2>Top 10 Miners</h2>
        <div id="minersContainer"></div>
     `
  }

  html() {
    return `
        <style>
          h3,h1, code {
              color: #999ba5;
              font-size: larger;
          }
         
          * > div {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
          }
        </style>
        <div class="">
        <h1>STRATUM CONNECT FOR ${ PoolService.getapi().toLowerCase().includes('alph') ? 'ALPH': 'ALPH'}</h1>
            ${ PoolService.getapi().toLowerCase().includes('alph') ? this.renderFiro() : this.renderFiro() }
        </div>
    `
  }
  connectedCallback() {

  }
}

customElements.define('x-connect', ConnectStratum);
