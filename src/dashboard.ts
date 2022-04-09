

class Dashboard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();

  }

  connectedCallback() {


  }

  private html() {
    return ` 
    <style>
        :host {
            padding: 0 40px;
            top: 40px;
           
            height: 100%;
            width: 60%;
            position: relative;
            z-index: 1;

            display: grid;
            gap: 10px;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas: 
            'card1 card2 card3'
            'card4 card5 card6';
        }
       div[class^="card"], div[class*=" card"] {
           border-radius: 40px; 
            border: 1px solid var(--theme-color);
          opacity: 1;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex: 1;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          
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
    </style>
      <div class="card1">
      
      </div>
    <div class="card2">
      
      </div>
      <div class="card3">
      
      </div>
      <div class="card4">
      
      </div>
      <div class="card5">
      
      </div>
      <div class="card6">
      
      </div>
    `;
  }
}

customElements.define('x-dash', Dashboard)
