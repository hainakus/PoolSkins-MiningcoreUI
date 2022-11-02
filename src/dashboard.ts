
import { statistics, blocks, payments } from "./api.service";
import { filter, pipe, tap } from "rxjs";
import * as  moment from "moment";
import { _formatter } from "./index";
import { store } from "./ws.service";
import { MarketStoreState } from "./store";


class Dashboard extends HTMLElement {
  private _networkHashrate: any;
  private _poolStats: any;
  private _blocks: any;

  set payments(value) {
      this._networkHashrate = value
  }
  get payments() {
    return this._networkHashrate;
  }
  set poolStats(value) {
    this._poolStats = value
  }
  get poolStats() {
    return this._poolStats;
  }
  set blocks(value) {
    this._blocks = value
  }
  get blocks() {
    return this._blocks;
  }
  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();

  }

  connectedCallback() {


    this.populateCards();


  }
  readableSeconds(t: number) {
    var seconds = Math.round(t);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);
    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
    if (isFinite(days) && days > 0) { return (days + "d " + hours + "h " + minutes + "m " + seconds + "s"); }
    if (isFinite(hours) && hours > 0) { return (hours + "h " + minutes + "m " + seconds + "s"); }
    if (isFinite(minutes) && minutes > 0) {return (minutes + "m " + seconds + "s"); }
    return seconds ? (seconds + "s") : '-';
  }

  private populateCards() {
    payments().subscribe( (payment:any) => {
        this.payments = payment.reduce( (paymnts:any, val:any) => {
           paymnts += val.amount / 1000000000000000000
          return paymnts
        }, 0)
    })
    blocks().subscribe(data => {
      const blocks = data;
      this.blocks = blocks.result.length;
    });
    store.query.select().pipe(filter(e => !!e), tap((data:any) => {
     

    })).subscribe( (data:MarketStoreState) => {
      console.log("data", data);

      this.poolStats = data?.pool?.ethone;
      var ttf;
      var coin;

      (window.location.href.includes('firo')) ? ttf = 150 : ttf = 15;
      (window.location.href.includes('firo')) ? coin = ' FIRO' : coin = ' ETHONE';
      var _ttfNetHashRate = this.poolStats?.network?.hashrate;
      var _ttfHashRate = this.poolStats?.hashrate;
      console.log(_ttfHashRate)
      // _ttfHashRate = 46992853600.7466667
      const timeToFind = this.readableSeconds(_ttfNetHashRate / _ttfHashRate * ttf );
     // const fee = data.body.primary.config.recipientFee * 100;
      const amountPaid = Number(data).toFixed(2);
      const networkDifficulty = this.shadowRoot.querySelector("#networkDifficulty");
      const networkHashrate = this.shadowRoot.querySelector("#networkHashRate");
      const heightBlock = this.shadowRoot.querySelector("#networkBlockHeight");
      const networkLastBlock = this.shadowRoot.querySelector("#networkLastBlock");
      const activeMiners = this.shadowRoot.querySelector("#activeMiners");
      const poolHash = this.shadowRoot.querySelector("#poolHashRate");
      const poolFee = this.shadowRoot.querySelector("#poolFee");
      const poolPaid = this.shadowRoot.querySelector("#poolPaid");

      networkDifficulty.innerHTML = _formatter(this.poolStats?.network?.difficulty, 5, "H/s");
      networkHashrate.innerHTML = _formatter(this.poolStats?.network?.hashrate, 5, "H/s");
      heightBlock.innerHTML = '';
      networkLastBlock.innerHTML = (Number(timeToFind.split('m')[0]) / 1440 * this.blocks * 100).toFixed(2) + "%";
      activeMiners.innerHTML = this.poolStats?.miners;
      poolHash.innerHTML = _formatter(this.poolStats?.hashrate, 2, "H/s");
      poolFee.innerHTML = timeToFind ? timeToFind : "-";
      poolPaid.innerHTML = this.payments?.toFixed(2) + coin;
    });
  }

  private html() {
    return ` 
    <style>
        /* Extra small devices (phones, 600px and down) */
          @media only screen and (max-width: 600px) {
              
          }
          
          /* Small devices (portrait tablets and large phones, 600px and up) */
          @media only screen and (min-width: 600px) {
              :host {
                    grid-template-columns: 1fr 1fr !important;
                    grid-template-rows: 1fr 1fr 1fr 1fr !important;
                    grid-template-areas: 
                    'card1 card2'
                     'card3 card4'
                    'card5 card6' 
                    'card7 card8';
        }
               }
          }
          
          /* Medium devices (landscape tablets, 768px and up) */
          @media only screen and (min-width: 768px) {...}
          
          /* Large devices (laptops/desktops, 992px and up) */
          @media only screen and (min-width: 992px) {...}
          
          /* Extra large devices (large laptops and desktops, 1200px and up) */
          @media only screen and (min-width: 1200px) {...}
    
    
        :host {
            padding: 0 40px;
            top: 40px;
           
            height: 100%;
            width: 800px;
            position: relative;
            z-index: 1;

            display: grid;
            gap: 20px;
            grid-template-columns:1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas: 
            'card1 card2 card3 card4'
            'card5 card6 card7 card8';
        }
       div[class^="card"], div[class*=" card"] {
          align-items: center;
          justify-content: start;
          gap: 10px;
          opacity: 1;
          width: 200px;
          height: 210px;
          display: flex;
          flex-direction: column;
          flex: 1;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgb(42 46 60);
          border-radius: 15%;
          box-shadow: 9.91px 9.91px 15px #21242d, -9.91px -9.91px 15px rgb(22 25 37);
          font-size: 20px;
          color: #999ba5;
       }
        div[class^="card"] span div, div[class*=" card"] span div { 
          color: #999ba5;        
        }
       span {
        color: #3c3a3a;
       }
        .card1{
          grid-area: card1;
          
          
        }
        .card2{
          grid-area: card2;

        }
        .card3{
          grid-area: card3;
   
        }
        .card4{
          grid-area: card4;
  
        }
        .card5{
          grid-area: card5;

        }
        .card6{
          grid-area: card6;
 
        }
          .card7{
          grid-area: card7;
 
        }
          .card8{
          grid-area: card8;
 
        }
        .loader {
        position: relative;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(45deg, transparent 40%, skyblue);
        animation: move 0.8s linear infinite;
      }
      .loader::before {
        position: absolute;
        content: "";
        top: 6px;
        left: 6px;
        right: 6px;
        bottom: 6px;
        background: #000;
        border-radius: 50%;
        z-index: 2;
      }
      .loader::after {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(45deg, transparent 40%, skyblue);
        filter: blur(20px);
      }
      @keyframes move {
        to {
          transform: rotate(360deg);
          filter: hue-rotate(360deg);
        }
      }

    </style>
      <div class="card1">

        <h4>Network Diff</h4>
        <span class="Difficulty"><div id="networkDifficulty"></div></span>

      </div>
      <div class="card2">
      
         <h4>Network Hash</h4>
         <span class="Network"><div id="networkHashRate"></div></span>
                        
      </div>
      <div class="card3">
 
        <h4>Current Effort</h4>
        <span class="Blockchain"><div id="networkBlockHeight"></div></span>
      </div>
      <div class="card4">

        <h4>Pool Luck</h4>
        <span class="Block"><div id="networkLastBlock"></div></span>
                        
      </div>
      <div class="card5">
         <h4>Active Miners</h4>
         <span><div id="activeMiners">0</div></span>
      </div>
      <div class="card6">
        <h4>Pool Hash</h4> 
        <span><div id="poolHashRate">0</div></span>
      </div>
      <div class="card7">
         <h4>TTF</h4>
          <span><div id="poolFee">0</div></span>
      </div>
      <div class="card8">
          <h4>Pool Total Paid</h4>
           <span><div id="poolPaid">0</div></span>
      </div>
    `;
  }
}

customElements.define('x-dash', Dashboard)
