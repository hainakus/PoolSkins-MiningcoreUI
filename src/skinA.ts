import { createQuery } from "@datorama/akita";
import { map, tap } from "rxjs";
import { blocks, getCoinPrice, miner, minerList, poolStats, statistics } from "./api.service";
import { _formatter, navigate } from "./index";
import { PoolService } from "./poolService";
import axios from "axios";
import { store } from "./ws.service";
import { MarketStoreState } from "./store";


console.log("Hello World!");


class SkinA extends HTMLElement {
   _poolFee: any;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();
    store.query.select().pipe(tap((data: any) => {
      if(!data.loading) {
        console.log('blocks', data?.pool?.kaspa.poolFeePercent)
        this.blocks = data?.pool?.kaspa?.totalBlocks;
        this.poolFee = data?.pool?.kaspa?.poolFeePercent
        this.miners = data?.pool?.kaspa?.poolStats?.connectedMiners
      }
    })).subscribe()
  }
  get poolFee () {
    return this._poolFee
  }
  set poolFee(value: any) {
    this._poolFee = value
    this.shadowRoot.getElementById('fee').innerHTML = value
  }
  private _miners: any;

  get miners() {
    return this._miners;
  }

  set miners(value: any) {
    console.log(value);
    this._miners = value;
    this.shadowRoot.querySelector("#miners").innerHTML = '0'
    this.shadowRoot.querySelector("#miners").innerHTML = value;
  }

  set blocks(value: any) {
    this.shadowRoot.querySelector("#blocks").innerHTML = value;
  }

  set coinPrice(value: any) {
    this.shadowRoot.querySelector("#price").innerHTML = !!value ? value.rate?.toFixed(5) : 0;
  }

  set minerHashrate(value: any) {
    console.log(value);
  }
  changePool() {


    (PoolService.getapi() === 'nexa1') ? this.navigate('/firo') : this.navigate('/')
  }
  navigate(url: string | URL) {
    window.history.pushState({}, null, url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  connectedCallback() {

    const forward = this.shadowRoot.getElementById('navForward');
    forward.addEventListener('click',  (  ) =>  {
      (PoolService.getapi() === 'nexa1') ? this.navigate( '/') : this.navigate( '/firo');

      window.dispatchEvent(new CustomEvent( 'togglePool'));
    });

    (!window.location.pathname.includes('firo')) ? PoolService.setApi('nexa1') : PoolService.setApi('nexa1');
    axios.defaults.baseURL = 'https://api.hydranetwork.online/api/pools/' + PoolService.getapi();
    const image = this.shadowRoot.querySelector('.pool-coin') as HTMLImageElement;
    (PoolService.getapi() === 'nexa1') ? image.src = 'https://k1pool.com/assets/media/logos/coin-nexa.png' : image.src = 'https://k1pool.com/assets/media/logos/coin-nexa.png';


    this.renderWorkersPartial();


    const nav = this.shadowRoot.querySelector("nav");
    const toggle = this.shadowRoot.querySelector(".pop-video");

    toggle.addEventListener("click", () => {
      nav.classList.toggle("open-nav");
      toggle.classList.toggle("open-nav");
    });


  }

  renderWorkersPartial() {


    getCoinPrice().subscribe(e => this.coinPrice = e);
    // minerList()
    //
    //   .subscribe((data:any) => {
    //     if(data)
    //       this.miners = data.reduce( (acc: any, value: any) => {
    //        return (value.hashrate > 0) ? acc + 1: acc;
    //       }, 0)
    //   });

    // query.select(state => state).pipe(tap((data: any) => {
    //   this.shadowRoot.querySelector("ul.miners").innerHTML = "";
    //   data.miners.forEach((mine: any) => {
    //     const li = document.createElement("li");
    //     miner(mine.miner).subscribe(e => this.minerHashrate = e);
    //     li.innerHTML = mine.miner + "  " + this.getReadableHashRateString(mine.hashrate);
    //
    //     this.shadowRoot.querySelector("ul.miners").append(li);
    //   });
    // })).subscribe();
    store.query.select()
      .pipe(
        tap((data:MarketStoreState) => {
        
          if(data && data.pool)
            console.log("stats", data);
            this.shadowRoot.querySelector("#pool").innerHTML = "";
            const poolHash = document.createElement("h1");
            poolHash.classList.add('ToFadeInAndOut')
            poolHash.innerText = "POOL HASHRATE " + _formatter((data.pool?.kaspa?.poolStats.poolHashrate), 2, "H/s");
            this.shadowRoot.querySelector("#pool").append(poolHash);

        }))
      .subscribe();

  }


  html() {
    return `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer" />   <style>

        a {
          text-decoration: none;
          color: #999ba5;
        }
        
        #c {
            width: 100vw;
            height: 100vh;
            display: block;
            z-index: -10;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
        }
        .overlay-canvas {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
           
            background-color: rgb(0,0,0, 0.45);
            opacity: 1;
             z-index: 0;
          }
  
           :host {
                       
                            margin: 0;
                            padding: 0;
                            font-family: Montserrat, sans-serif;
                            font-size:12px;
                            color:#F5F5F5;
                            height:100%;
                          
                      }

            .hero {
              
              background-size: cover;
              background-position: center;
              width: 100%;
        
              
              transition: background 1s linear;

  
            }
          
            .center-content {
                grid-area: footer;
                bottom: 30px;
                right: 30px;
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              margin: auto;
            }
            .center-content h1, .center-content h3 {
              color: white;
              line-height: 1;
            }
            .center-content h1 {
              
              margin: 0;
              text-align: end;
              font-size: 5.5rem;
              cursor:pointer;
               color: #FFF;
              font-weight: 400;
      
            }
            .center-content h3 {
              text-transform: uppercase;
              margin-bottom: 40px;
              font-size: 1.5em;
              font-weight: normal;
            }
            
            .button {
              text-transform: uppercase;
              color: white;
              padding: 18px;
              width: 25%;
              border: 1px solid white;
              text-decoration: none;
              font-size:.5rem;
              transition: 0.1s ease-in-out;
              transition-property: color, background-color, border-color;
              text-align: center; 

            }
            .button:hover {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.7);
              color: white;
            }
            .navigation {
                  display: flex;
                  flex-direction: row;
                  margin-top: 30px;
                  align-items: center;
                  position: absolute;
                  width: 100%;
                  top: 0;
            }
            .navigation svg {
                cursor: pointer;
            }
            .footer {
                display: flex;
                flex-direction: row;
                gap: 20px;
            }
            .pop-video {
              border-radius: 50px;
              background: var(--theme-bg-color);
 
            }
            .pop-video img {
                 cursor: pointer;
                   z-index: 999;
                   transform: scale(0.87);
            }
            .pop-video.open-nav svg path, .pop-video.open-nav svg polygon {
              fill: var(--theme-bg-color);
            }
            .buttons {
                
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                gap: 20px;
                color: #666;
                font-size: 18px;
                  font-weight: bold;
            }
              .pop-video {
              display: flex;
              flex-direction: column;
              justify-content: center;
                 flex: 0;   
                 justify-self: flex-end;
                 margin-right: 30px;
                   z-index: 999;
            }
            
            
            .overlay {
              position: fixed;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              /*background: rgba(0, 154, 201, 0.85);*/
              background: rgb(29,29,38);
              display: flex;
              flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
            }


                
            }


            .image-mask {
              
               
          
                text-align: center;
           
            }
            div.workers {
  
              margin-top: 20px;
            }
            .workers li {
              font-size: 20px;
              font-weight: bold;
            }
            #play {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background: transparent;
                align-self: center;
                position: absolute;
                height: 5%;
         
                cursor: pointer;
            }
            .cards{
               position: relative;
                font-size: 12px;
                color: #999ba5;
            }
            p {
            font-family: Roboto,sans-serif;
            font-weight: 800;
            font-size: 40px;
            color: #999ba5;
           }
          .col {
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-wrap: wrap;
          }
          .row {
          display: flex;
          flex-direction: row;
          width: 100%;
          flex-wrap: nowrap;
          }
        .container {
          padding: 0px 20px 0px 20px;
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; 
          grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr; 
          gap: 50px; 
          grid-template-areas: 
            ". . dash dash dash dash"
            "score . dash dash dash dash"
            "score . dash dash dash dash"
            "score . . . . ."
            ". . . . . ."
            ". . footer footer footer footer"; 
            justify-items: self-start;
            margin-left: 40px;
            margin-right: 40px;
            top: 60px;
            max-height: 100vh;
            max-width: 100%;
        }
        
        .finder {
          grid-area: finder;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }   
        .score { 
        grid-area: score; }
        .card { 
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: white;
        grid-area: card;
        border-radius: 51px;
        background: linear-gradient(315deg, #c8c8c8, #eeeeee);
        box-shadow:  -5px -5px 10px #888,
                     5px 5px 10px #ffffff;
                     width: 80%;
                     height: 226px;
         }
        .card2 { 
        grid-area: card2;
        border-radius: 51px;
        background: linear-gradient(315deg, #c8c8c8, #eeeeee);
        box-shadow:  -5px -5px 10px #888,
                     5px 5px 10px #ffffff;
                     width:  80%;
                     height: 226px;
         }
         .card3 { 
        grid-area: card3;
        border-radius: 51px;
        background: linear-gradient(315deg, #c8c8c8, #eeeeee);
        box-shadow:  -5px -5px 10px #888,
                     5px 5px 10px #ffffff;
                     width:  80%;
                     height: 226px;
         }
         ::slotted(*) {
            grid-area: dash;
         }
          .ToFadeInAndOut {
            opacity: 1;
            color: #FFF;
            animation: fade 4s linear;
        }


        @keyframes fade {
            0%,100% { color: #FFF }
            20% {  color: #fddd79  }
            40% {  color: #fddd79 }
        }
        x-card {
        position: relative;
        }
        .open-nav {
          transform: translateX(0%);
        }
        
        nav {
          grid-area: nav;
        
   
        }
        
        nav ul {
          display: flex;
          flex-direction: row;
          gap: 2em;
          margin-top: 8em;
        }
        
        nav li {
          list-style-type: none;
          font-size: 2em;
          margin: 0.5em 2em;
        }
        x-search {
          align-self: center;
          justify-self: center;
        }
        
        .far,.fa-solid {
  font-size: 2rem;
}

.button {
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin: 1rem;
  position: relative;
   width: 40px;
  height: 40px; 
  padding: 15px;
  background: var(--theme-bg-color);
  border-radius: 999px;
  box-shadow: 9.91px 9.91px 15px #21242d, -9.91px -9.91px 15px rgb(22 25 37);
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
}

.button:focus, .button:hover {
  color: black;
}

.button:focus,
.button:active {
  background-color: var(--theme-bg-color);
   box-shadow: 9.91px 9.91px 15px #21242d, -9.91px -9.91px 15px rgb(22 25 37);
}

    </style>



        
              <div class="hero">
             
                  <div class="navigation">
                        <div class="buttons">   
                            <svg class="button-back" id="navBack" width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#FFF"  stroke-width="1.03" points="13 16 7 10 13 4"></polyline></svg>
                            <svg id="navForward" class="button-fwd"  width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#FFF"  stroke-width="1.03" points="7 4 13 10 7 16"></polyline></svg></a>
                   
                     
                           <a href="" onclick="${navigate('connect')}"> <button class="button" type="button">
                              <i class="fa-solid fa-circle-nodes"></i>
                            </button>
                            </a>
                           <a href="" onclick="${navigate('wallet')}" >
                            <button class="button" type="button">
                              <i class="fa-solid fa-wallet"></i>
                            </button>
                            </a>
                              <a href="" onclick="${navigate('payments')}" >
                            <button class="button" type="button">
                              <i class="fa-solid fa-money-bill"></i>
                            </button>
                            </a>
                            <a href="${window.location.pathname === '/' ? '' : window.location.pathname}/" >
                              <div class="pop-video">
                                  <img width="50px" class="pool-coin"
                              src="assets/etherone_logo.png">
                             </div>
                             </a>
                        </div>
                      
                      
                    
                  </div> 
                 
                  </nav>
                
<!--                    <div class="card"><x-card></x-card><h1>Dummy</h1></div>-->
<!--                    <div class="card2"></div>-->
<!--                     <div class="card3"></div>-->
<!--                <div class="play-btn" id="play">-->
<!--              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">-->
<!--                      <g>-->
<!--                        <g fill="#FFF">-->
<!--                          <path d="m354.2,247.4l-135.1-92.4c-4.2-3.1-15.4-3.1-16.3,8.6v184.8c1,11.7 12.4,11.9 16.3,8.6l135.1-92.4c3.5-2.1 8.3-10.7 0-17.2zm-130.5,81.3v-145.4l106.1,72.7-106.1,72.7z"/>-->
<!--                          <path d="M256,11C120.9,11,11,120.9,11,256s109.9,245,245,245s245-109.9,245-245S391.1,11,256,11z M256,480.1    C132.4,480.1,31.9,379.6,31.9,256S132.4,31.9,256,31.9S480.1,132.4,480.1,256S379.6,480.1,256,480.1z"/>-->
<!--                        </g>-->
<!--                      </g>-->
<!--                    </svg>-->
       
                  <main >
                  <div class="container">
                    <slot></slot>
                                      <div class="cards score">
                        <p id="miners"></p>  Miners
                        <p id="blocks"></p>  Blocks
                        ${window.location.href.includes('firo') ? 'NEXA' : 'NEXA'}  
                        <p id="price"></p> USD
                      
                      </div>
                      
              <div class="center-content">
            
<!--                 <a href="#" class="button play-btn">ERGO POOL</a>-->
                <h1 class="image-mask"><slot name="title"><div id="pool"></div> </slot></h1>
                <h3>Pool Fee  <span id="fee"></span> %, SOLO/PROP</h3>
                <div class="footer">
                   <a href="https://t.me/LocalFiroBot">
                       
                  <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 80 80" width="40px" height="40px"><path d="M 70.511719 10.986328 C 69.833089 11.015588 69.157051 11.196735 68.537109 11.4375 L 68.535156 11.4375 C 67.931048 11.673297 64.049934 13.281226 58.392578 15.628906 C 52.735222 17.976586 45.3821 21.032905 38.091797 24.064453 C 23.51119 30.12755 9.1835937 36.091797 9.1835938 36.091797 L 9.2480469 36.068359 C 9.2480469 36.068359 8.4485192 36.330303 7.6484375 36.871094 C 7.2483967 37.141489 6.8283994 37.486951 6.4960938 37.966797 C 6.163788 38.446643 5.9299055 39.103809 6.0195312 39.808594 C 6.1812736 41.080477 7.0482024 41.912426 7.7636719 42.412109 C 8.4791414 42.911793 9.1660156 43.148437 9.1660156 43.148438 L 9.1738281 43.152344 L 23.1875 47.785156 C 23.418097 48.587707 27.163839 61.631062 28.046875 64.384766 C 28.50876 65.826709 28.935922 66.627156 29.335938 67.130859 C 29.535944 67.382711 29.733459 67.561543 29.931641 67.683594 C 30.016841 67.736064 30.101273 67.771554 30.183594 67.802734 C 30.197014 67.807834 30.211349 67.817736 30.224609 67.822266 C 30.252855 67.83191 30.267938 67.831811 30.302734 67.839844 C 31.62302 68.328201 32.738281 67.476563 32.738281 67.476562 L 32.769531 67.453125 L 42.376953 59 L 56.585938 70.394531 L 56.710938 70.449219 C 58.991132 71.431474 60.875783 70.891854 61.970703 70.027344 C 63.065623 69.162833 63.509766 68.03125 63.509766 68.03125 L 63.544922 67.943359 L 73.794922 16.097656 C 74.046117 14.98858 74.071392 14.057617 73.853516 13.257812 C 73.635643 12.458006 73.128863 11.807693 72.5 11.443359 C 71.871137 11.079025 71.190348 10.957066 70.511719 10.986328 z M 70.566406 13.021484 C 70.96444 13.004357 71.29991 13.059037 71.498047 13.173828 C 71.696183 13.288619 71.824951 13.420226 71.923828 13.783203 C 72.022708 14.14618 72.046557 14.758873 71.84375 15.654297 L 71.839844 15.667969 L 61.630859 67.3125 C 61.615849 67.34707 61.352842 67.965627 60.730469 68.457031 C 60.102941 68.952505 59.248838 69.318622 57.578125 68.626953 L 34.738281 50.310547 A 1.0001 1.0001 0 0 0 34 50 A 1.0001 1.0001 0 0 0 32.988281 50.974609 L 30.384766 64.923828 C 30.251656 64.61729 30.108215 64.257609 29.953125 63.773438 C 29.147161 61.260079 25.522903 48.675314 25.166016 47.435547 L 61.013672 24.226562 A 1.0001 1.0001 0 0 0 62 25 A 1.0001 1.0001 0 0 0 62.988281 23.783203 C 63.014848 23.477186 62.989225 23.17624 62.855469 22.876953 C 62.639651 22.394056 62.128723 22.100054 61.765625 22.03125 C 61.039429 21.893642 60.566406 22.158203 60.566406 22.158203 L 60.466797 22.195312 L 23.857422 45.900391 L 9.8261719 41.261719 L 9.8222656 41.259766 C 9.8185507 41.25848 9.3777555 41.099419 8.9082031 40.771484 C 8.4366726 40.442168 8.062164 40.014757 8.0039062 39.556641 C 7.9835322 39.396426 8.0143062 39.287873 8.140625 39.105469 C 8.2669443 38.923065 8.501119 38.707449 8.7675781 38.527344 C 9.3004964 38.167134 9.8886719 37.962891 9.8886719 37.962891 L 9.9199219 37.951172 L 9.953125 37.9375 C 9.953125 37.9375 24.279232 31.97306 38.859375 25.910156 C 46.149446 22.878704 53.503668 19.823883 59.160156 17.476562 C 64.816644 15.129243 68.856374 13.458984 69.261719 13.300781 C 69.707777 13.127547 70.168373 13.038612 70.566406 13.021484 z M 59.199219 25.699219 L 58.398438 26.101562 L 58.240234 26.984375 L 58.853516 27.638672 L 59.199219 27.699219 L 60 27.298828 L 60.158203 26.416016 L 59.546875 25.761719 L 59.199219 25.699219 z M 56.400391 28.400391 L 55.599609 28.800781 L 55.441406 29.683594 L 56.052734 30.337891 L 56.400391 30.400391 L 57.201172 29.998047 L 57.359375 29.117188 L 56.746094 28.462891 L 56.400391 28.400391 z M 53.599609 31.099609 L 52.798828 31.501953 L 52.640625 32.382812 L 53.251953 33.037109 L 53.599609 33.099609 L 54.400391 32.699219 L 54.558594 31.816406 L 53.947266 31.162109 L 53.599609 31.099609 z M 50.800781 33.800781 L 49.998047 34.201172 L 49.841797 35.083984 L 50.453125 35.738281 L 50.800781 35.800781 L 51.601562 35.398438 L 51.759766 34.517578 L 51.146484 33.861328 L 50.800781 33.800781 z M 48 36.5 L 47.199219 36.902344 L 47.041016 37.783203 L 47.652344 38.4375 L 48 38.5 L 48.800781 38.099609 L 48.958984 37.216797 L 48.347656 36.5625 L 48 36.5 z M 45.199219 39.199219 L 44.398438 39.601562 L 44.240234 40.484375 L 44.853516 41.138672 L 45.199219 41.199219 L 46.001953 40.798828 L 46.158203 39.916016 L 45.546875 39.261719 L 45.199219 39.199219 z M 42.400391 41.900391 L 41.599609 42.300781 L 41.441406 43.183594 L 42.052734 43.837891 L 42.400391 43.900391 L 43.201172 43.498047 L 43.359375 42.617188 L 42.746094 41.962891 L 42.400391 41.900391 z M 39.599609 44.599609 L 38.798828 45.001953 L 38.640625 45.882812 L 39.253906 46.537109 L 39.599609 46.599609 L 40.400391 46.199219 L 40.558594 45.316406 L 39.947266 44.662109 L 39.599609 44.599609 z M 36.800781 47.300781 L 35.998047 47.701172 L 35.841797 48.583984 L 36.453125 49.238281 L 36.800781 49.300781 L 37.601562 48.898438 L 37.759766 48.015625 L 37.146484 47.361328 L 36.800781 47.300781 z M 34.675781 52.824219 L 40.794922 57.730469 L 32.378906 65.132812 L 34.675781 52.824219 z"/></svg>
                    </a>
                     <a href="https://github.com/hainakus">
                        <svg width="36" height="36" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="github" fill="#FFF"><path d="M10,1 C5.03,1 1,5.03 1,10 C1,13.98 3.58,17.35 7.16,18.54 C7.61,18.62 7.77,18.34 7.77,18.11 C7.77,17.9 7.76,17.33 7.76,16.58 C5.26,17.12 4.73,15.37 4.73,15.37 C4.32,14.33 3.73,14.05 3.73,14.05 C2.91,13.5 3.79,13.5 3.79,13.5 C4.69,13.56 5.17,14.43 5.17,14.43 C5.97,15.8 7.28,15.41 7.79,15.18 C7.87,14.6 8.1,14.2 8.36,13.98 C6.36,13.75 4.26,12.98 4.26,9.53 C4.26,8.55 4.61,7.74 5.19,7.11 C5.1,6.88 4.79,5.97 5.28,4.73 C5.28,4.73 6.04,4.49 7.75,5.65 C8.47,5.45 9.24,5.35 10,5.35 C10.76,5.35 11.53,5.45 12.25,5.65 C13.97,4.48 14.72,4.73 14.72,4.73 C15.21,5.97 14.9,6.88 14.81,7.11 C15.39,7.74 15.73,8.54 15.73,9.53 C15.73,12.99 13.63,13.75 11.62,13.97 C11.94,14.25 12.23,14.8 12.23,15.64 C12.23,16.84 12.22,17.81 12.22,18.11 C12.22,18.35 12.38,18.63 12.84,18.54 C16.42,17.35 19,13.98 19,10 C19,5.03 14.97,1 10,1 L10,1 Z"></path></svg>
                    </a>
                    
                </div>
              </div>
              </div>
                  </main>
   
       
                 
              </div>
              
          
            </div>
        `;
  }

  private getReadableHashRateString = function(hashrate: number) {
    if (hashrate < 1000000) {
      return (Math.round(hashrate / 1000) / 1000).toFixed(2) + " KB/s";
    }
    var byteUnits = [" MH/s", " GH/s", " TH/s", " PH/s"];
    var i = Math.floor((Math.log(hashrate / 1000) / Math.log(1000)) - 1);
    hashrate = (hashrate / 1000) / Math.pow(1000, i + 1);
    return hashrate.toFixed(2) + byteUnits[i];
  };

}

customElements.define("x-skin-a", SkinA);
