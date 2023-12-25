import { payments } from "./api.service";
import { tap } from "rxjs";

export class Payments extends HTMLElement {
  private _pay: any;

  set payments(value:any) {
    this._pay = value;
  }

  get payments() {
    return this._pay;
  }
  constructor() {
    super();
    this.attachShadow({mode: 'open'})



  }
  renderFiro() {
    let html: string = '';
    this.payments?.forEach( (miner:any)  => {

      console.log(this.payments)
      html +=`<tr><td>Miner ${ miner }</td><td> ${miner} to be paid NEXA</td></tr>`;
      console.log(html)

    })
    this.shadowRoot.querySelector('#tobePaid').innerHTML = html;

    html = '';
    this.payments?.forEach( (miner:any)  => {

      console.log(this.payments)
      html +=`<tr><td>Miner ${ miner }</td><td> ${miner} paid NEXA</td></tr>`;
      console.log(html)

    })
    this.shadowRoot.querySelector('#paid').innerHTML = html;
  }
  renderNeox() {
    let html: string = '';
     Object.entries(this.payments?.immature).forEach( ([miner, tobePaid]) => {

      console.log(this.payments)
       html +=`<tr><td>Miner ${ miner }</td><td> ${tobePaid} to be paid NEOX</td></tr>`;
       console.log(html)

    })
    this.shadowRoot.querySelector('#tobePaid').innerHTML = html;

    html = '';
    Object.entries(this.payments?.paid).forEach( ([miner, tobePaid]) => {

      console.log(this.payments)
      html +=`<tr><td>Miner ${ miner }</td><td> ${tobePaid} paid NEOX</td></tr>`;
      console.log(html)

    })
    this.shadowRoot.querySelector('#paid').innerHTML = html;
  }
  html() {
    return `
        <style>
          * {
              color: #999ba5;
              font-size: small;
          }
          :host {
            margin-top: 40px;
          }
          * > div {
            display: flex;
            flex-direction: row;
            margin-top: 40px;
          }
          table {
            margin-bottom: 50px;
          }
          table, th, td {
          border: 1px solid white;
          }
        </style>
        <div class="">
        <h1>PAYMENTS FOR ${window.location.pathname.includes('nexa1') ?  'NEXA': 'NEXA' }</h1>
        <table>
            <tbody id="tobePaid">
            
            </tbody>
  
          
            </table>
            
              <table>
            <tbody id="paid">
            
            </tbody>
  
          
            </table>
        </div>
    `
  }
  connectedCallback() {
    payments().pipe(tap ( payments => this.payments = payments)).subscribe(_=>  {
      this.shadowRoot.innerHTML = this.html();
      console.log('PAYM', this.payments);
      (window.location.pathname.includes('/')) ? this.renderFiro(): this.renderFiro();
    })

  }
}

customElements.define('x-payments', Payments);
