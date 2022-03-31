import * as d3 from 'd3'

class Card extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();

  }

  connectedCallback() {
    const data:any = [
      {
        name: "Department 1",
        users: 50
      },
      {
        name: "Department 2",
        users: 100
      },
      {
        name: "Department 3",
        users: 70
      },
      {
        name: "Department 4",
        users: 80
      },
      {
        name: "Department 5",
        users: 10
      },
      {
        name: "Department 6",
        users: 90
      }
    ];

    const width = 100;
    const height = 100;
    const r = 50;

    const colorScale = d3
      .scaleSequential(d3.interpolate("Indigo", "DeepPink"))
      .domain([10, 100]);
    const element = this.shadowRoot.querySelector(".chartContainer")
    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const graph = svg.append("g").attr("transform", `translate(${r} ${r})`);

    const arc:any = d3
      .arc()
      .innerRadius(r - r / 3)
      .outerRadius(r)
      .cornerRadius(2.5)
      .padAngle(0.025);

    const pie = d3.pie().value((d:any) => d.users);

    const arcs = graph
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.value));

    svg.node();
  }

  private html() {
    return ` 
 <style>
 :host {
     align-self: flex-start;
    margin-left: 20px;
    margin-top: 20px;
 }
 .chartContainer {
  overflow: auto;
  position: relative;
  width: inherit;
}
.chartContainer > svg {
  height: auto;
  width: 100%;
}
</style>
     <div class="chartContainer"></div>
    
    `;
  }
}

customElements.define('x-card', Card)