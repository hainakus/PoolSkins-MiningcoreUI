import ApexCharts from "apexcharts";
import { getCoinPrice, miner, poolStats } from "./api.service";
import { RouterLocation } from "@vaadin/router";
import { _formatter } from "./index";
import { firstValueFrom, interval, switchMap } from "rxjs";
import _ from "lodash";

export class Wallet extends HTMLElement {
  private _hashrate: any;
  private minerHash:  number;
  private topWorkers: any;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.html()
    console.log('construct')
  }
  set minerData(value) {
    this._hashrate = value
  }
  get minerData() {
   return this._hashrate
  }
  connectedCallback() {
    const location : RouterLocation = window.location as unknown as RouterLocation
    console.log( location.pathname.split('/').reverse()[0])
    const wallet = location.pathname.split('/').reverse()[0];

    interval(15000).pipe(switchMap( () => miner(wallet))).subscribe( async (data) => {
      this.minerData = data;
      this.minerHash = data.performanceSamples.map((i: any) => {
        let datas: any[] = [];

        const val = Object.values(i.workers).reduce((paymnts: any, val: any) => {
          paymnts += val.hashrate
          return paymnts
        }, 0) as number

        datas = [...datas, ...[i.created, val]]
        return datas
      }).pop()[1]

      console.log(this.minerHash)
      this.shadowRoot.getElementById('current').innerHTML = await this.calculateMinerReward(this.minerHash) + ' EUR'
      const htmlContainer = this.shadowRoot.getElementById('workers');

        const  topWorkers = _.cloneDeep(this.minerData.performance.workers)
      console.log(this.minerData)
        this.topWorkers = []

        for (const miner in topWorkers) {
           this.topWorkers.push({ miner: miner, hashrate: topWorkers[miner].hashrate})
        }
        console.log('top', this.topWorkers)
        htmlContainer.innerHTML = ''
        const topMinersHTML = `
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Worker</th>
        <th>Hashrate</th>

      </tr>
    </thead>
    <tbody>
       ${this.topWorkers?.sort((a: { hashrate: number; }, b: { hashrate: number; }) => b.hashrate - a.hashrate).map( (m: { miner: any; hashrate: number; }, i: any) => `
       <tr>
        <td>${i}</td>
        <td>${m.miner}</td>
        <td>${_formatter(m.hashrate, 2, 'H/s')}</td>
  
      </tr>
      
      `).join('')}
    </tbody>
  </table>
`;
        htmlContainer.innerHTML = topMinersHTML;
    })

    miner(wallet).subscribe(  async data => {
      console.log(data)
      this.minerData = data;
      this.minerHash = data.performanceSamples.map((i: any) => {
        let datas: any[] = [];

        const val = Object.values(i.workers).reduce((paymnts: any, val: any) => {
          paymnts += val.hashrate
          return paymnts
        }, 0) as number

        datas = [...datas, ...[i.created, val]]
        return datas
      }).pop()[1]
      const htmlContainer = this.shadowRoot.getElementById('workers');

      const  topWorkers = _.cloneDeep(this.minerData.performance.workers)
      console.log(this.minerData)
      this.topWorkers = []

      for (const miner in topWorkers) {
        this.topWorkers.push({ miner: miner, hashrate: topWorkers[miner].hashrate})
      }
      console.log('top', this.topWorkers)
      htmlContainer.innerHTML = ''
      const topMinersHTML = `
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Worker</th>
        <th>Hashrate</th>
      </tr>
    </thead>
    <tbody>
       ${this.topWorkers?.sort((a: { hashrate: number; }, b: { hashrate: number; }) => b.hashrate - a.hashrate).map( (m: { miner: any; hashrate: number; }, i: any) => `
       <tr>
        <td>${i}</td>
        <td>${m.miner}</td>
        <td>${_formatter(m.hashrate, 2, 'H/s')}</td>

      </tr>
      
      `).join('')}
    </tbody>
  </table>
`;
      htmlContainer.innerHTML = topMinersHTML;
      this.shadowRoot.getElementById('total').innerHTML = this.minerData?.totalPaid.toFixed(2) + ' ALPH'
      this.shadowRoot.getElementById('today').innerHTML = this.minerData?.todayPaid.toFixed(2) + ' ALPH'
      this.shadowRoot.getElementById('current').innerHTML = await this.calculateMinerReward(this.minerHash) + ' EUR'
      console.log(data.performanceSamples.map((i: any) => {
        let datas: any[] = [];

        const val = Object.values(i.workers).reduce((paymnts: any, val: any) => {
          paymnts += val.hashrate
          return paymnts
        }, 0) as number

        datas = [...datas, ...[i.created, _formatter(val, 3, 'h/s')]]
        return datas
      }).splice(0, 140))
      var options1 = {
        chart: {
          id: "chart2",
          type: "area",
          height: 230,
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        colors: ["#00eaca"],
        stroke: {
          width: 3
        },
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.55,
            opacityTo: 0
          }
        },
        markers: {
          size: 5,
          colors: ["#000524"],
          strokeColor: "#00eaca",
          strokeWidth: 3
        },
        series: [
          {
            data: data.performanceSamples.map((i: any) => {
              let datas: any[] = [];

              const val = Object.values(i.workers).reduce((paymnts: any, val: any) => {
                paymnts += val.hashrate
                return paymnts
              }, 0) as number

              datas = [...datas, ...[i.created, _formatter(val, 3, 'h/s')]]
              return datas.splice(0, 40)
            }).reverse().splice(0, 40).reverse()
          }
        ],
        tooltip: {
          theme: "dark"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          min: 0,
          tickAmount: 4
        }
      };

      var chart1 = new ApexCharts(this.shadowRoot.getElementById("chart-area"), options1);


      var options2 = {
        chart: {
          id: "chart2",
          height: 130,
          type: "bar",
          foreColor: "#ccc",
          brush: {
            target: "chart2",
            enabled: true
          },
          selection: {
            enabled: true,
            fill: {
              color: "#fff",
              opacity: 0.4
            },
            xaxis: {
              min: new Date("27 Jul 2017 10:00:00").getTime(),
              max: new Date("14 Aug 2017 10:00:00").getTime()
            }
          }
        },
        colors: ["#00eaca"],
        series: [
          {
            data: data
          }
        ],
        stroke: {
          width: 2
        },
        grid: {
          borderColor: "#444"
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "datetime",
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          tickAmount: 2
        }
      };

      var chart1 = new ApexCharts(this.shadowRoot.getElementById("chart-area"), options1);
      chart1.render();
    })

  }

  async calculateMinerReward(hashrate: number) {
    // Calculate the miner's share of the total network hashrate
    const networkStats = await firstValueFrom(poolStats())
    console.log("network", networkStats, hashrate)
    const minerShare = hashrate  / networkStats.pool.networkStats.networkHashrate

    // Calculate the average block reward
    const totalBlocksperday =  24 * 60 * 60 / 64 * 16 // Assumes a 64 aleph block time
     console.log(minerShare)
    // Calculate the miner's reward per block



    const totalReward24h = minerShare * totalBlocksperday * 2.36
    const coinPrice = await firstValueFrom(getCoinPrice())
    console.log(coinPrice, totalReward24h)
    // Calculate the total value of the miner's reward in 24 hours
    return (totalReward24h * parseInt(coinPrice.rate)).toFixed(2);
  }

// // Example usage:
//   const hashrate = 100; // Miner's hashrate in TH/s
//   const blockchainDifficulty = 1000000; // Current blockchain difficulty
//   const currentHashrate = 1000; // Total network hashrate in TH/s
//   const coinPrice = 50; // Price of the coin in USD
//
//   const reward24h = calculateMinerReward(hashrate, blockchainDifficulty, currentHashrate, coinPrice);
//   console.log("Miner reward in 24 hours:", reward24h.toFixed(2), "USD");

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
#wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: start;
  box-shadow: 0 22px 35px -16px rgba(0, 0, 0, 0.71);
  max-width: 100%;
  gap:40px
}
#workers {
width: 30%;
}
#dataList {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 40px;
}
#dataList p {
color: #00eaca;
    font-size: xx-large;
}
#chart-area {
     padding: 20px;
    margin-bottom: 40px;
    width: 60%;
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

<div id="wrapper">
  <div id="chart-area">

  </div>
  <div id="workers">
      
  </div>
  
 
</div>
 <div id="dataList">
 <div>
  <h1>Total Paid</h1>
    <p id="total">0</p>
</div>
     <div>
  <h1>Today Paid</h1>
      <p id="today">0</p>
</div>
 <div>
  <h1>Reward 24h</h1>
      <p id="current">0</p>
</div> 
</div>
     `;
  }

}

customElements.define('x-wallet', Wallet);
