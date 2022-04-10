import * as  THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three";
import { statistics } from "./api.service";
import { pipe, tap } from "rxjs";
import * as  moment from "moment";
import { _formatter } from "./index";


class Dashboard extends HTMLElement {
  private _networkHashrate: any;
  private _poolStats: any;

  set networkHashrate(value) {
      this._networkHashrate = value
  }
  get networkHashrate() {
    return this._networkHashrate;
  }
  set poolStats(value) {
    this._poolStats = value
  }
  get poolStats() {
    return this._poolStats;
  }
  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();

  }

  connectedCallback() {

    statistics().pipe(tap( data => {
      console.log(data)
      if(data) {
        this.networkHashrate = data.pools[0].networkStats
        this.poolStats = data.pools[0].poolStats
        const fee = data.pools[0].poolFeePercent
        const amountPaid = data.pools[0].totalPaid
        const networkDifficulty = this.shadowRoot.querySelector('#networkDifficulty')
        const networkHashrate = this.shadowRoot.querySelector('#networkHashRate')
        const heightBlock = this.shadowRoot.querySelector('#networkBlockHeight')
        const networkLastBlock = this.shadowRoot.querySelector('#networkLastBlock')
        const activeMiners = this.shadowRoot.querySelector('#activeMiners')
        const poolHash = this.shadowRoot.querySelector('#poolHashRate')
        const poolFee = this.shadowRoot.querySelector('#poolFee')
        const poolPaid = this.shadowRoot.querySelector('#poolPaid')

        networkDifficulty.innerHTML = _formatter(this.networkHashrate.networkDifficulty, 5, "H/s");
        networkHashrate.innerHTML = _formatter(this.networkHashrate.networkHashrate, 5, "H/s");
        heightBlock.innerHTML = this.networkHashrate.blockHeight
        networkLastBlock.innerHTML = moment(this.networkHashrate.lastNetworkBlockTime).format('DD/MM/YYYY, HH:MM:SS');
        activeMiners.innerHTML = this.poolStats.connectedMiners
        poolHash.innerHTML = this.poolStats.poolHashrate
        poolFee.innerHTML = fee + ' %'
        poolPaid.innerHTML = amountPaid + ' ERG'
      }
    })).subscribe()
  }



  private html() {
    return ` 
    <style>
        :host {
            padding: 0 40px;
            top: 40px;
           
            height: 100%;
            width: 80%;
            position: relative;
            z-index: 1;

            display: grid;
            gap: 20px;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas: 
            'card1 card2 card3 card4'
            'card5 card6 card7 card8';
        }
       div[class^="card"], div[class*=" card"] {
          align-items: center;
          justify-content: start;
          gap: 25px;
          opacity: 1;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex: 1;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: #EEF0F4;
          border-radius: 15%;
          box-shadow: 9.91px 9.91px 15px #D9DADE, -9.91px -9.91px 15px #FFFFFF;
          font-size: 20px;
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

        <h4>Network Difficulty</h4>
        <span class="Difficulty"><div id="networkDifficulty"></div></span>

      </div>
      <div class="card2">
      
         <h4>Network Hash Rate</h4>
         <span class="Network"><div id="networkHashRate"></div></span>
                        
      </div>
      <div class="card3">
 
        <h4>Blockchain Height</h4>
        <span class="Blockchain"><div id="networkBlockHeight"></div></span>
      </div>
      <div class="card4">

        <h4>Last Block</h4>
        <span class="Block"><div id="networkLastBlock"></div></span>
                        
      </div>
      <div class="card5">
         <h4>Active Miners</h4>
         <span><div id="activeMiners">0</div></span>
      </div>
      <div class="card6">
        <h4>Pool Hash Rate</h4> 
        <span><div id="poolHashRate">0</div></span>
      </div>
      <div class="card7">
         <h4>Pool Fee</h4>
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
