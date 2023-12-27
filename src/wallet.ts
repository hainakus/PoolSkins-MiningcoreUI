
import ApexCharts from "apexcharts";

export class Wallet extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.html()
    console.log('construct')
  }
  connectedCallback() {
    console.log('connected')

    var data = generateDayWiseTimeSeries(new Date("22 Apr 2017").getTime(), 115, {
      min: 30,
      max: 90
    });
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
      colors: ["#00BAEC"],
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
        strokeColor: "#00BAEC",
        strokeWidth: 3
      },
      series: [
        {
          data: data
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

    function generateDayWiseTimeSeries(baseval: number, count: number, yrange: { min: number; max: number }) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = baseval;
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
      }
      return series;
    }

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
  border: 1px solid #000;
  box-shadow: 0 22px 35px -16px rgba(0, 0, 0, 0.71);
  max-width: 100%;

}

#chart-bar {
  position: relative;
  margin-top: -38px;
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
