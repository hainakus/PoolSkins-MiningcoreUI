import { Chart } from "chart.js";


export class Wallet extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.html()

  }
  connectedCallback() {
    const ctx = this.shadowRoot.getElementById('myChart') as HTMLCanvasElement

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
    });
  }
  html() {

    return `
<style>
:host {
  display: flex;
  width:400px;
  height: 600px;
  flex: 1;
}
 #myChart {
  width: 300px;
  height: 400px;
 }
</style>

<div class="chart-container" style="position: relative; height:40vh; width:80vw">
    <canvas id="myChart" width="300" height="400">   <p>Hello Fallback World</p></canvas>
</div>
 
     `;
  }

}

customElements.define('x-wallet', Wallet);
