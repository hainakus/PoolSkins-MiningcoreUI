import { miner } from "./api.service";
import { catchError, tap } from "rxjs";

export class Chart extends HTMLElement {
  display = false;
  render = false;
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.html()
  }

  html() {
    return `
        <style>
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;
        }
         .send {
  position: relative;
  display: flex;
  align-items: center;
  color: #353535;
  background: transparent;
  border: none;
  font-family: inherit;
  padding: 0;
  border-radius: 3rem;
  font-size: 2rem;
  font-variation-settings: "wght" 500;
  cursor: pointer;
  transition: transform 0.4s ease-out;
  box-shadow: 9px 9px 16px 0px #a3b1c6, -9px -9px 16px 0px rgba(255, 255, 255, 0.6);
}
.send:hover .icon svg {
  transform: translate(-5px, 5px);
}

.text {
  height: 2.5rem;
  padding: 1rem 1rem 1rem 2rem;
}

.icon {
  display: block;
  padding: 1rem;
  box-shadow: 9px 9px 16px 0px #a3b1c6, -9px -9px 16px 0px rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: currentColor;
  width: 2rem;
  height: 2rem;
  transition: transform 0.4s ease-out;
  
  
}
  input {
width: 56vmin;
height: 15vmin;
border: none;
border-radius: 1rem;
outline: none;
font-size: 7.5vmin;
font-weight: bold;
padding: 0 4vmin;
box-shadow: var(--inner-shadow);
background: var(--greyLight-1);
color: var(--primary);
caret-color: var(--primary);
}

  h1 {
              color: #999ba5;
              font-size: xxx-large;
          }
        </style>
        
       <input type="text" placeholder="wallet address" value=""/>
       <button class="send"><span class="text">Send</span>
         <span class="icon">
            <svg viewBox="0 0 512.005 512.005">
              <path d="M511.658 51.675c2.496-11.619-8.895-21.416-20.007-17.176l-482 184a15 15 0 00-.054 28.006L145 298.8v164.713a15 15 0 0028.396 6.75l56.001-111.128 136.664 101.423c8.313 6.17 20.262 2.246 23.287-7.669C516.947 34.532 511.431 52.726 511.658 51.675zm-118.981 52.718L157.874 271.612 56.846 232.594zM175 296.245l204.668-145.757c-176.114 185.79-166.916 176.011-167.684 177.045-1.141 1.535 1.985-4.448-36.984 72.882zm191.858 127.546l-120.296-89.276 217.511-229.462z"></path>
            </svg>
          </span>
        </button>
        <div id="wallet"></div>
    `
  }
  connectedCallback() {
     const sendButton = this.shadowRoot.querySelector('.send') as HTMLElement;
     const inputWallet = this.shadowRoot.querySelector('input') as HTMLInputElement;
     sendButton.addEventListener('click', () => {
       const wallet = inputWallet.value;
       if( wallet !== '') {
         miner(wallet).pipe(tap( _ => {



         })).subscribe( _ => {
           sendButton.style.display = 'none';
           inputWallet.style.display = 'none';
           if(_.body.primary.workers.shared.length === 0 && _.body.primary.workers.solo.length === 0) {
             this.display = true
             const doc = this.shadowRoot.querySelector('#wallet')
             doc.innerHTML = this.displayNotFound(_)
           } else {
             const doc = this.shadowRoot.querySelector('#wallet')
             doc.innerHTML = this.renderWallet(_)
           }
         }, catchError( (e:any) => this.displayNotFound(e)), () => {})
       }
     })
  }

  private renderWallet(res: any) {
    console.log(res)
    return JSON.stringify(res)
  }

  private displayNotFound(e: any) {
    return `  <div class="">
        <h1>$WALLET NOT FOUND $</h1>
        </div>  `
  }
}

customElements.define('x-chart', Chart);
