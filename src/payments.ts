import { blocks, payments } from "./api.service";
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

      console.log(miner)
      html +=`<tr><td><a href="${miner?.infoLink}">  ${ miner?.blockHeight }</a></td><td> <progress max="100" value="${miner.confirmationProgress * 100}">${miner.confirmationProgress * 100}%</progress></td><td>${miner.miner}</td><td>${Math.floor(miner.effort * 100)}%</td></tr>`;
      console.log(html)

    })
    this.shadowRoot.querySelector('#tobePaid').innerHTML = html;

    html = '';
    this.payments?.forEach( (miner:any)  => {

      console.log(this.payments)
      html +=`<tr><td>Miner ${ miner }</td><td> ${miner} paid </td></tr>`;
      console.log(html)

    })

  }
  renderNeox() {
    let html: string = '';
     Object.entries(this.payments?.immature).forEach( ([miner, tobePaid]) => {

      console.log(this.payments)
       html +=`<tr><td>${ miner }</td><td> ${tobePaid} to be paid NEOX</td></tr>`;
       console.log(html)

    })
    this.shadowRoot.querySelector('#tobePaid').innerHTML = html;

    html = '';
    Object.entries(this.payments?.paid).forEach( ([miner, tobePaid]) => {

      console.log(this.payments)
      html +=`<tr><td>Miner ${ miner }</td><td> ${tobePaid} paid NEOX</td></tr>`;
      console.log(html)

    })
    //this.shadowRoot.querySelector('#paid').innerHTML = html;
  }
  html() {
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
        h1 {
            margin-top: 45px;
        }
 progress::-webkit-progress-value {
            background-color: #FF0080; /* Set the color for WebKit browsers (Chrome, Safari) */
        }

        /* Style for the progress bar track */
        progress::-webkit-progress-bar {
            background-color: #2a2e3c; /* Set the color for WebKit browsers (Chrome, Safari) */
        }

        /* Style for the progress bar value for other browsers */
        progress::-moz-progress-bar {
            background-color: #FF0080; /* Set the color for Mozilla Firefox */
        }

        /* Style for the progress bar track for other browsers */
        progress {
            background-color: #2a2e3c; /* Set the color for other browsers */
        }

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
      a { text-decoration: none; color: #ffffff }
        </style>
        <div class="">
        <h1>REWARDS FOR ${window.location.pathname.includes('alph') ? 'ALPH' : 'ALPH'}</h1>
        <table>
            <thead>
            <th>Height</th>
            <th>Progress</th>
            <th>Miner</th>
            <th>Effort</th>
</thead>
            <tbody id="tobePaid">
            
            </tbody>
  
          
            </table>
            
         
        </div>
    `
  }
  connectedCallback() {
    blocks().pipe(tap ( payments => this.payments = payments)).subscribe(_=>  {
      this.shadowRoot.innerHTML = this.html();
      console.log('PAYM', this.payments);
      (window.location.pathname.includes('/')) ? this.renderFiro(): this.renderFiro();
    })

  }
}

customElements.define('x-payments', Payments);
