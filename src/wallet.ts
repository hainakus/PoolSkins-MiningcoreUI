
import ApexCharts from "apexcharts";
import { miner } from "./api.service";
import { Router, Params, RouterLocation } from "@vaadin/router";
import { _formatter } from "./index";

export class Wallet extends HTMLElement {
  private _hashrate: any;

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
    miner(wallet).subscribe(  data => {
      console.log(data)
      this.minerData = data;

      this.shadowRoot.getElementById('total').innerHTML = this.minerData?.totalPaid.toFixed(2) + ' ALPH'
      this.shadowRoot.getElementById('today').innerHTML = this.minerData?.todayPaid.toFixed(2) + ' ALPH'

      console.log(data.performanceSamples.map( (i:any) => { let datas: any[] =  [];

          const val = Object.values(i.workers).reduce( (paymnts:any, val:any) => {
            paymnts += val.hashrate
            return paymnts
          }, 0) as number

          datas = [...datas, ...[ i.created, _formatter(val,  3,'h/s') ]]
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
        colors: ["#FF0080"],
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
          strokeColor: "#FF0080",
          strokeWidth: 3
        },
        series: [
          {
            data: data.performanceSamples.map( (i:any) => { let datas: any[] =  [];

              const val = Object.values(i.workers).reduce( (paymnts:any, val:any) => {
                paymnts += val.hashrate
                return paymnts
              }, 0) as number

              datas = [...datas, ...[ i.created, _formatter(val,  3,'h/s') ]]
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
        colors: ["#FF0080"],
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

  onflyRewardCalculation() {
    // const ApiUrl = 'https://api.alephium-pool.com';
    //
    // function statsApiCall(action) {
    //   return fetch(`${ApiUrl}${action}`)
    //     .then(response => response.json())
    // }
    //
    // function fetchPoolProfit() {
    //   return statsApiCall('/profit');
    // }
    //
    // function fetchRate() {
    //   return statsApiCall(`/rate`)
    // }
    //
    // function getPoolProfitUSD(rate, profit) {
    //   return profit * rate
    // }
    //
    // function perHour(value) {
    //   return (value / 24);
    // }
    //
    // function costsPerTime(powerConsumption, electricityCosts, multiplier = 1) {
    //   return powerConsumption * multiplier / 1000 * electricityCosts;
    // }
    //
    // function perWeek(value) {
    //   return (value * 7);
    // }
    //
    // function addCell(td) {
    //   return td.insertCell();
    // }
    //
    // function addValue(tr, value, currencyValue = '', sign = '') {
    //   tr.innerHTML = `${sign}` + ` ${parseFloat(value).toFixed(4)}` + ` ${currencyValue}`
    // }
    //
    // // @ts-ignore
    // function addRow(tbody, period, reward, income, costs, profit, currencyValue) {
    //   let td = tbody.insertRow();
    //   let trPeriod = td.insertCell();
    //   trPeriod.innerHTML = period;
    //   addValue(addCell(td), reward, 'ALPH');
    //   addValue(addCell(td), income, currencyValue);
    //   addValue(addCell(td), costs, currencyValue, '-');
    //   addValue(addCell(td), profit, currencyValue);
    // }
    //
    // // @ts-ignore
    // function generateTable(hashrateValue: number) {
    //
    //
    //   const powerConsumptionValue = calculatorForm.power_consumption.value;
    //   const currencyValue = "USD";
    //   const electricityCostsValue = calculatorForm.electricity_costs.value;
    //
    //   Promise.all([fetchRate(), fetchPoolProfit()]).then(function([object1, object2]) {
    //     let tbody = document.getElementsByTagName('tbody')[0];
    //     tbody.innerHTML = "";
    //
    //     let reward = object2.profit * hashrateValue;
    //     let income = getPoolProfitUSD(object1.rate, reward);
    //
    //     addRow(
    //       tbody,
    //       '1 hour',
    //       perHour(reward),
    //       perHour(income),
    //       costsPerTime(powerConsumptionValue, electricityCostsValue),
    //       perHour(income) - costsPerTime(powerConsumptionValue, electricityCostsValue),
    //       currencyValue)
    //
    //     addRow(
    //       tbody,
    //       '24 hours',
    //       reward,
    //       income,
    //       costsPerTime(powerConsumptionValue, electricityCostsValue, 24),
    //       income - costsPerTime(powerConsumptionValue, electricityCostsValue, 24),
    //       currencyValue)
    //
    //     addRow(
    //       tbody,
    //       '7 days',
    //       perWeek(reward),
    //       perWeek(income),
    //       costsPerTime(powerConsumptionValue, electricityCostsValue, 168),
    //       perWeek(income) - costsPerTime(powerConsumptionValue, electricityCostsValue, 168),
    //       currencyValue)
    //   })
    //
    // }
    //
    // const calculatorForm = document.forms.calculator_form;
    //
    // calculatorForm.addEventListener("submit", function (event) {
    //   event.preventDefault();
    //   generateTable(calculatorForm);
    // });
    //
    // function init(calculatorForm) {
    //   generateTable(calculatorForm);
    // }
    //
    // init(calculatorForm);
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
#wrapper {
  position: relative;
  border: 1px solid #FFF;
  box-shadow: 0 22px 35px -16px rgba(0, 0, 0, 0.71);
  max-width: 100%;

}
#dataList {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 40px;
}
#dataList p {
color: #ff0080;
    font-size: xx-large;
}
#chart-area {
     padding: 20px;
    margin-bottom: 40px;
}

</style>

<div id="wrapper">
  <div id="chart-area">

  </div>
  <div id="chart-bar">

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
      <p>234 ALPH</p>
</div> 
</div>
     `;
  }

}

customElements.define('x-wallet', Wallet);
