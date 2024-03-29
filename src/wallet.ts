
import ApexCharts from "apexcharts";
import { miner } from "./api.service";
import { Router, Params, RouterLocation } from "@vaadin/router";
import { _formatter } from "./index";

export class Wallet extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.html()
    console.log('construct')
  }
  connectedCallback() {
    const location : RouterLocation = window.location as unknown as RouterLocation
    console.log( location.pathname.split('/').reverse()[0])
    const wallet = location.pathname.split('/').reverse()[0];
    miner(wallet).subscribe(  data => {
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
        colors: ["#ffda70"],
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
          strokeColor: "#ffde63",
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
  html() {

    return `
<style>
:host {
  display: flex;
  flex-direction: column;
  width:100%;
  height: 600px;
margin-top: 100px;
}
#wrapper {
  position: relative;
  border: 1px solid #FFF;
  box-shadow: 0 22px 35px -16px rgba(0, 0, 0, 0.71);
  max-width: 100%;

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
 
     `;
  }

}

customElements.define('x-wallet', Wallet);
