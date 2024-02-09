
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
      this.blocks = blocks.length;
    });
    store.query.select().pipe(filter(e => !!e), tap((data:any) => {
     

    })).subscribe( (data:MarketStoreState) => {
      console.log("data", data);

      this.poolStats = data?.pool?.kaspa;
      var ttf;
      var coin;

      (window.location.href.includes('firo')) ? ttf = 3.8 : ttf = 3.8;
      (window.location.href.includes('firo')) ? coin = ' ALPH' : coin = ' ALPH';
      var _ttfNetHashRate = this.poolStats?.networkStats.networkHashrate;
      var _ttfHashRate = this.poolStats?.poolStats?.poolHashrate;
      console.log('pool',this.poolStats?.poolEffort)
      // _ttfHashRate = 46992853600.7466667

        const timeToFind = this.readableSeconds(_ttfNetHashRate / _ttfHashRate * ttf);

        // const fee = data.body.primary.config.recipientFee * 100;
      const amountPaid = Number(data).toFixed(2);
      const networkDifficulty = this.shadowRoot.querySelector("#networkDifficulty");
      const networkHashrate = this.shadowRoot.querySelector("#networkHashRate");
      const networkLastBlock = this.shadowRoot.querySelector("#networkLastBlock");

      const poolHash = this.shadowRoot.querySelector("#poolHashRate");
      const poolFee = this.shadowRoot.querySelector("#poolFee");
      const poolPaid = this.shadowRoot.querySelector("#poolPaid");
      const expectedHashes = this.poolStats?.networkStats.networkDifficulty * (2**32);
// Function to calculate pool luck
      function calculatePoolLuck(poolHashRate: number, networkDifficulty: number, blocksFound: number) {
        // Calculate the expected time to find a block
        const expectedTime = networkDifficulty / poolHashRate;

        // Calculate the pool's luck based on recent block discoveries
        const poolLuck = blocksFound / expectedTime;

        return poolLuck;
      }

// Example usage
      const poolHashRate = this.poolStats?.poolStats.poolHashrate; // in hashes per second

      const blocksFound = 0; // number of blocks found by the pool

      const luck = calculatePoolLuck(poolHashRate, this.poolStats?.networkDifficulty, blocksFound);
      console.log("Pool Luck:", luck);

      networkDifficulty.innerHTML = _formatter(this.poolStats?.networkStats.networkDifficulty, 5, " ");
      networkHashrate.innerHTML = _formatter(this.poolStats?.networkStats.networkHashrate, 5, "H/s");

      networkLastBlock.innerHTML =`${(this.poolStats?.poolEffort * 100).toFixed(2)}%`;

      poolHash.innerHTML = _formatter(_ttfHashRate, 2, "H/s");
      poolFee.innerHTML = timeToFind ? timeToFind : "-";
      poolPaid.innerHTML = this.poolStats?.totalPaid.toFixed(2) + coin;
    });
  }

  private html() {
    return ` 
    <style>

          
          /* Medium devices (landscape tablets, 768px and up) */
          @media only screen and (min-width: 768px) {...}
          
          /* Large devices (laptops/desktops, 992px and up) */
          @media only screen and (min-width: 992px) {...}
          
          /* Extra large devices (large laptops and desktops, 1200px and up) */
          @media only screen and (min-width: 1200px) {...}
    
    
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
       div[class^="card"], div[class*=" card"] {
          align-items: center;
          justify-content: start;
          gap: 10px;
          opacity: 1;
          min-width: 150px;
          min-height: 160px;
          display: flex;
          flex-direction: column;
       
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgb(42 46 60);
          border-radius: 15%;
          box-shadow: 9.91px 9.91px 15px #21242d, -9.91px -9.91px 15px rgb(22 25 37);
          font-size: 1.85rem;
          color: #999ba5;
          font-weight: 100;
       }
        div[class^="card"] span div, div[class*=" card"] span div { 
          color: #999ba5;        
        }
       span {
        color: #3c3a3a;
       }
       .wrap_cards {
       display: flex;
       flex-direction: row;
       flex-wrap: wrap;
    gap: 30px;
        justify-content: flex-end;
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
    <div class="wrap_cards">
      <div class="card1">

        <h4>Network Diff</h4>
        <span class="Difficulty"><div id="networkDifficulty"></div></span>

      </div>
      <div class="card2">
      
         <h4>Network Hash</h4>
         <span class="Network"><div id="networkHashRate"></div></span>
                        
      </div>
      <div class="card4">

        <h4>Pool Effort</h4>
        <span class="Block"><div id="networkLastBlock"></div></span>
                        
      </div>
      </div>
      <div class="wrap_cards">
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
    </div>  
    `;
  }
}

customElements.define('x-dash', Dashboard)
