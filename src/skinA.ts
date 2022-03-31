import { createQuery } from "@datorama/akita";
import { map, tap } from "rxjs";
import * as THREE from "three";
import { Strip, StripGeometry, UvPreset } from "three-strip";
import { getErgoPrice, miner, minerList, poolStats, statistics } from "./api.service";
import { globalStore } from "./index";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Frame } from "../../../Documents/GitHub/three-strip/src/Type";
import { Matrix4 } from "three";

class SkinA extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });


    this.shadowRoot.innerHTML = this.html();

  }

  private _miners: any;

  get miners() {
    return this._miners;
  }

  set miners(value: any) {
    console.log(value);
    this._miners = value;
    this.shadowRoot.querySelector("#miners").innerHTML = value.pools[0].poolStats.connectedMiners;
  }

  set blocks(value: any) {
    this.shadowRoot.querySelector("#blocks").innerHTML = value.pools[0].totalBlocks;
  }

  set ergoPrice(value: any) {
    this.shadowRoot.querySelector("#price").innerHTML = value.rate.toFixed(2);
  }

  set minerHashrate(value: any) {
    console.log(value);
  }

  connectedCallback() {


    this.main();
    this.renderWorkersPartial();
    poolStats().pipe(tap((minersArray: any) => {
      minersArray.stats.forEach((minerData: { miner: string; }) =>
        miner(minerData.miner).subscribe(e => this.minerHashrate = e)
      );
    }), map(data => data.stats.reverse()[0])).subscribe();
    statistics().subscribe(e => {
      this.blocks = e;
      this.miners = e;
    });
    getErgoPrice().subscribe(e => this.ergoPrice = e);


    const triggerBttn = this.shadowRoot.querySelector(".pop-video");
    const closeBttn = this.shadowRoot.querySelector(".close");

    const bg = this.shadowRoot.querySelector(".hero");
    const toggleOverlay = () => {

      const overlay = this.shadowRoot.querySelector(".overlay");
      if (overlay.className.split(" ").includes("open")) {
        overlay.classList.remove("open");

        bg.classList.remove("clear");

      } else {
        overlay.className += " open ";
      }
    };
    triggerBttn.addEventListener("click", toggleOverlay);
    closeBttn.addEventListener("click", toggleOverlay);

  }

  renderWorkersPartial() {
    const store = globalStore;
    const query = createQuery(store.store);

    minerList()
      .pipe(tap(miners =>
        store.setState(miners)
      ))
      .subscribe();

    query.select(state => state).pipe(tap((data: any) => {
      this.shadowRoot.querySelector("ul").innerHTML = "";
      data.miners.forEach((mine: any) => {
        const li = document.createElement("li");
        miner(mine.miner).subscribe(e => this.minerHashrate = e);
        li.innerHTML = mine.miner + "  " + this.getReadableHashRateString(mine.hashrate);

        this.shadowRoot.querySelector("ul").append(li);
      });
    })).subscribe();
    poolStats()
      .pipe(map(pool => pool.stats.reverse()[0]),
        tap(stats => {
          this.shadowRoot.querySelector("#pool").innerHTML = "";
          const poolHash = document.createElement("h1");
          poolHash.innerText = "POOL HASHRATE " + this.getReadableHashRateString(stats.poolHashrate);
          this.shadowRoot.querySelector("#pool").append(poolHash);
        }))
      .subscribe();

  }


  main() {
    const renderer = new THREE.WebGLRenderer({ alpha: true } );
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 2, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);

    scene.background = new THREE.Color('#dedede');
    camera.position.set(0, 0, 5);
    controls.autoRotate = true;
    controls.enableDamping = true;
    renderer.shadowMap.enabled = true;

    const light = new THREE.DirectionalLight('white', 1);
    light.position.set(-2, 2, 1);
    scene.add(light);
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    scene.add(new THREE.AmbientLight('white', .5));

    const N_SEG = 400;
    const BREADTH = .5;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, -1, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(1, 1, 0),
      new THREE.Vector3(1, -1, 0),
    ], true);
    const radius_fn = (i: number, I: number) => .1 + .5 * (1 - 2 * Math.abs(i / I - .5));
    const tilt = (i: number, I: number) => Math.PI * i / I * 6;
    // @ts-ignore
    const strip = new Strip(curve, radius_fn, tilt);
    const frames = strip.computeFrames(N_SEG);
// scene.add(new StripHelper(strip, N_SEG));
    const strip_geom:any = new StripGeometry(strip, N_SEG);
    const mat = new THREE.MeshPhysicalMaterial({ clearcoat: 1, roughness: 1, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(strip_geom, mat);
    scene.add(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    function f(strip_geom: { getAttribute: (arg0: string) => { (): any; new(): any; array: any } }, radius_fn: { (i: any, I: any): number; (arg0: number, arg1: number): number }, frames: Frame[], result: Matrix4) { // random pos lying on strip
      const ab_pos = strip_geom.getAttribute('position').array;
      const n_idx = ab_pos.length / 6; // /3/2
      const idx = Math.random() * n_idx | 0;
      const pa = new THREE.Vector3(...ab_pos.subarray(idx * 6, idx * 6 + 3));
      const pb = new THREE.Vector3(...ab_pos.subarray(idx * 6 + 3, idx * 6 + 6));
      const pa2pb = new THREE.Vector3().subVectors(pb, pa);
      const len = 2 * radius_fn(idx, n_idx);
      pa2pb.normalize().multiplyScalar(len * Math.random());
      pa.add(pa2pb);
      const [B, N, T] = frames[idx];
      // @ts-ignore
      result.makeBasis(B, N, T).setPosition(pa);
    }

// texture by Hans Isaacson - https://unsplash.com/photos/kFEHiT68zno
    const url = 'https://images.unsplash.com/photo-1636442330662-6f0a898190a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMTJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60';
    const tex = new THREE.TextureLoader().load(url);
    tex.wrapT = THREE.MirroredRepeatWrapping;
    { // https://codepen.io/ycw/pen/KKZgPyB?editors=1000
      const N_INST = 1000;
      // @ts-ignore
      const strip = new Strip(new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(.5, .8, 0),
        new THREE.Vector3(-.1, 2, 0),
        new THREE.Vector3(0, 0, 0),
      ), (i, I) => .15 * (i / I), (i, I) => Math.PI * 0.4 * i / I * 0);
      const geom = new StripGeometry(strip, 32, UvPreset.strip[0]);
      const mat = new THREE.MeshPhysicalMaterial({ side: THREE.DoubleSide, roughness: 1, alphaMap: tex, alphaTest: .3 });
      // @ts-ignore
      const mesh = new THREE.InstancedMesh(geom, mat, N_INST);
      const $mat_basis = new THREE.Matrix4();
      const $mat_r = new THREE.Matrix4(); // ry
      const $mat_s = new THREE.Matrix4(); // scale
      const $col = new THREE.Color();
      for (let i = 0; i < N_INST; ++i) {
        $mat_r.makeRotationY(Math.PI * Math.random());
        $mat_s.makeScale(Math.random() + .1, Math.random(), Math.random() + .1);
        f(strip_geom, radius_fn, frames, $mat_basis);
        mesh.setMatrixAt(i, $mat_basis.multiply($mat_r).multiply($mat_s));
        mesh.setColorAt(i, $col.setHSL(Math.random(), .1, .2));
      }
      scene.add(mesh);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }


// ----
// render
// ----

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      controls.update();
      tex.offset.y += 0.01;
    });

// ----
// view
// ----

    function resize(w: number, h: number, dpr = devicePixelRatio) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    addEventListener('resize', () => resize(innerWidth, innerHeight));
    dispatchEvent(new Event('resize'));
    document.querySelector('body').prepend(renderer.domElement);
  }

  html() {
    return `
   <style>
        body {
            margin: 0;
           
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
            /*.hero::before {*/
            /*      content: "";*/
            /*      position: absolute;*/
            /*      top: 0; left: 0;*/
            /*      width: 100%; height: 100%;*/
            
            /*     background-repeat: no-repeat;*/
            /*     background-size: cover;*/
            /*    -webkit-filter: grayscale(.8); !* Google Chrome, Safari 6+ & Opera 15+ *!*/
            /*    filter: grayscale(.8) brightness(0.9); !* Microsoft Edge and Firefox 35+ *!*/
            /*    }*/
            /*     .hero.clear::before {*/
            /*      content: "";*/
            /*      position: absolute;*/
            /*      top: 0; left: 0;*/
            /*      width: 100%; height: 100%;*/
            
            /*     background-repeat: no-repeat;*/
            /*     background-size: cover;*/
            /*    -webkit-filter: grayscale(0); !* Google Chrome, Safari 6+ & Opera 15+ *!*/
            /*    filter: grayscale(0) brightness(0.9); !* Microsoft Edge and Firefox 35+ *!*/
            /*    }*/
            .center-content {
                position: absolute;
                bottom: 30px;
                right: 30px;
              width: 50%;
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
              
              margin-bottom: 0;
              text-align: end;
              font-size: 7.5rem;
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
                  z-index: 9999;
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
            .pop-video svg {
                 cursor: pointer;
            }
            .buttons {
                flex: 1;
            }
              .pop-video {
                 flex: 0;   
                 justify-self: flex-end;
                 margin-right: 30px;
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
            .overlay nav {
              text-align: center;
              position: relative;
              top: 50%;
              height: 60%;
              font-size: 54px;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
            }
            .overlay ul {
              list-style: none;
              padding: 0;
              margin: 0 auto;
              display: inline-block;
              height: 100%;
              position: relative;
            }
            .overlay ul li {
              display: block;
              height: 20%;
              height: calc(100% / 5);
            }
            .overlay ul li a {
              font-weight: 300;
              display: block;
              color: #ffffff;
              text-decoration: none;
              -webkit-transition: color 0.2s;
              -moz-transition: color 0.2s;
              transition: color 0.2s;
            }
            .overlay ul li a:hover, .overlay ul li a:focus {
              color: rgba(255, 255, 255, 0.7);
            }
            .overlay .close {
              width: 80px;
              height: 80px;
              position: absolute;
              right: 20px;
              top: 20px;
              overflow: hidden;
              border: none;
              background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/113212/cross.png) no-repeat center center;
              text-indent: 200%;
              outline: none;
              color: transparent;
              z-index: 100;
            }
            
            .overlay-effect {
              opacity: 0;
              visibility: hidden;
              -webkit-transition: opacity 0.5s, visibility 0s 0.5s;
              -moz-transition: opacity 0.5s, visibility 0s 0.5s;
              transition: opacity 0.5s, visibility 0s 0.5s;
            }
            .overlay-effect.open {
              opacity: 1;
              visibility: visible;
              -webkit-transition: opacity 0.5s;
              -moz-transition: opacity 0.5s;
              transition: opacity 0.5s;
            }
            .overlay-effect nav {
              -webkit-perspective: 1200px;
              perspective: 1200px;
            }
            .overlay-effect nav ul {
              opacity: 0.4;
              -webkit-transform: translateY(-25%) rotateX(35deg);
              transform: translateY(-25%) rotateX(35deg);
              -webkit-transition: -webkit-transform 0.5s, opacity 0.5s;
              transition: transform 0.5s, opacity 0.5s;
            }
            
            .overlay-effect.open nav ul {
              opacity: 1;
              -webkit-transform: rotateX(0deg);
              transform: rotateX(0deg);
            }
            
            .overlay-effect.close nav ul {
              -webkit-transform: translateY(25%) rotateX(-35deg);
              transform: translateY(25%) rotateX(-35deg);
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
            }
            p {
            font-family: Roboto,sans-serif;
            font-weight: 800;
            font-size: 40px;
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
        
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr 1fr; 
          grid-template-rows: 1fr 1fr 1fr 1fr; 
          gap: 10px 10px; 
          grid-template-areas: 
            ". card card2 card3"
            "score . . ."
            "score . . ."
            ". . . ."; 
            justify-items: self-start;
            margin-left: 40px;
            z-index: 9999;
            top: 40px;
            position: absolute;
            left: 10px;
            right: 10px;
            max-height: 350px;
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
        x-card {
        position: relative;
        }
    </style>

       <div id="c"></div>

        
              <header class="hero">
             
              <div class="navigation">
                    <div class="buttons">   
                        <svg class="button-back" width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#FFF"  stroke-width="1.03" points="13 16 7 10 13 4"></polyline></svg>
                        <svg class="button-fwd" width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#FFF"  stroke-width="1.03" points="7 4 13 10 7 16"></polyline></svg>
                    </div>
                  
                    <div class="pop-video">
                  <svg width="30" height="34" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       viewBox="0 0 58.4 58.4" style="enable-background:new 0 0 58.4 58.4;" xml:space="preserve" icon>
                          <style type="text/css">
                          \t.st0{fill-rule:evenodd;clip-rule:evenodd;}
                          </style>
                                  <title>Group 16</title>
                                  <desc>Created with Sketch.</desc>
                                  <g id="main">
                          \t<g id="Group-16" transform="translate(-70.000000, -35.000000)">
                          \t\t<g transform="translate(70.000000, 34.000000)">
                          \t\t\t<g id="Group-15" transform="translate(0.000000, 0.830280)">
                          \t\t\t\t<path fill="white" id="Fill-9" class="st0" d="M11.2,47.8l18.3,7.4l18.2-7.8L55,29.1l-7.8-18.2L28.9,3.6l-18.2,7.8L3.4,29.7L11.2,47.8z
                          \t\t\t\t\t M29.5,58.6c-0.2,0-0.4,0-0.6-0.1L9.3,50.6c-0.4-0.2-0.7-0.5-0.9-0.9L0.1,30.3c-0.2-0.4-0.2-0.8,0-1.3L8,9.5
                          \t\t\t\t\tc0.2-0.4,0.5-0.7,0.9-0.9l19.4-8.3c0.4-0.2,0.8-0.2,1.3,0l19.6,7.9C49.5,8.3,49.8,8.6,50,9l8.3,19.4c0.2,0.4,0.2,0.8,0,1.3
                          \t\t\t\t\tl-7.9,19.6c-0.2,0.4-0.5,0.7-0.9,0.9l-19.4,8.3C30,58.6,29.7,58.6,29.5,58.6z"/>
                                  <polygon fill="white" id="Fill-10" class="st0" points="33.4,29.1 25.6,37.7 38,37.7 38,41.5 20.5,41.5 20.5,37.7 28.3,29.1 20.5,21
                          \t\t\t\t\t20.5,17.3 38,17.3 38,21 25.8,21 \t\t\t\t"/>
                          \t\t\t</g>
                          \t\t</g>
                          \t</g>
                          </g>
                      </svg>

                    </div>
              </div> 
              <div class="container">
                    <div class="card"><x-card></x-card><h1>Dummy</h1></div>
                    <div class="card2"></div>
                     <div class="card3"></div>
<!--                <div class="play-btn" id="play">-->
<!--              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">-->
<!--                      <g>-->
<!--                        <g fill="#FFF">-->
<!--                          <path d="m354.2,247.4l-135.1-92.4c-4.2-3.1-15.4-3.1-16.3,8.6v184.8c1,11.7 12.4,11.9 16.3,8.6l135.1-92.4c3.5-2.1 8.3-10.7 0-17.2zm-130.5,81.3v-145.4l106.1,72.7-106.1,72.7z"/>-->
<!--                          <path d="M256,11C120.9,11,11,120.9,11,256s109.9,245,245,245s245-109.9,245-245S391.1,11,256,11z M256,480.1    C132.4,480.1,31.9,379.6,31.9,256S132.4,31.9,256,31.9S480.1,132.4,480.1,256S379.6,480.1,256,480.1z"/>-->
<!--                        </g>-->
<!--                      </g>-->
<!--                    </svg>-->
                    <slot name="cards">
                     <div class="cards score">
                        <p id="miners"></p>  Miners
                        <p id="blocks"></p>  Blocks
                        ERG
                        <p id="price"></p> USD
                      </div>
                </slot>
                </div>
                 
              </div>
              <div class="center-content">
<!--                 <a href="#" class="button play-btn">ERGO POOL</a>-->
                <h1 class="image-mask"><slot name="title"><div id="pool"></div> </slot></h1>
                <h3>Pool Fee 1%, PPLNS</h3>
                <div class="footer">
                   <a href="">
                        <svg width="36" height="36" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="linkedin" fill="#FFF"><path  d="M5.77,17.89 L5.77,7.17 L2.21,7.17 L2.21,17.89 L5.77,17.89 L5.77,17.89 Z M3.99,5.71 C5.23,5.71 6.01,4.89 6.01,3.86 C5.99,2.8 5.24,2 4.02,2 C2.8,2 2,2.8 2,3.85 C2,4.88 2.77,5.7 3.97,5.7 L3.99,5.7 L3.99,5.71 L3.99,5.71 Z"></path><path d="M7.75,17.89 L11.31,17.89 L11.31,11.9 C11.31,11.58 11.33,11.26 11.43,11.03 C11.69,10.39 12.27,9.73 13.26,9.73 C14.55,9.73 15.06,10.71 15.06,12.15 L15.06,17.89 L18.62,17.89 L18.62,11.74 C18.62,8.45 16.86,6.92 14.52,6.92 C12.6,6.92 11.75,7.99 11.28,8.73 L11.3,8.73 L11.3,7.17 L7.75,7.17 C7.79,8.17 7.75,17.89 7.75,17.89 L7.75,17.89 L7.75,17.89 Z"></path></svg>
                    </a>
                     <a href="https://github.com/hainakus">
                        <svg width="36" height="36" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="github" fill="#FFF"><path d="M10,1 C5.03,1 1,5.03 1,10 C1,13.98 3.58,17.35 7.16,18.54 C7.61,18.62 7.77,18.34 7.77,18.11 C7.77,17.9 7.76,17.33 7.76,16.58 C5.26,17.12 4.73,15.37 4.73,15.37 C4.32,14.33 3.73,14.05 3.73,14.05 C2.91,13.5 3.79,13.5 3.79,13.5 C4.69,13.56 5.17,14.43 5.17,14.43 C5.97,15.8 7.28,15.41 7.79,15.18 C7.87,14.6 8.1,14.2 8.36,13.98 C6.36,13.75 4.26,12.98 4.26,9.53 C4.26,8.55 4.61,7.74 5.19,7.11 C5.1,6.88 4.79,5.97 5.28,4.73 C5.28,4.73 6.04,4.49 7.75,5.65 C8.47,5.45 9.24,5.35 10,5.35 C10.76,5.35 11.53,5.45 12.25,5.65 C13.97,4.48 14.72,4.73 14.72,4.73 C15.21,5.97 14.9,6.88 14.81,7.11 C15.39,7.74 15.73,8.54 15.73,9.53 C15.73,12.99 13.63,13.75 11.62,13.97 C11.94,14.25 12.23,14.8 12.23,15.64 C12.23,16.84 12.22,17.81 12.22,18.11 C12.22,18.35 12.38,18.63 12.84,18.54 C16.42,17.35 19,13.98 19,10 C19,5.03 14.97,1 10,1 L10,1 Z"></path></svg>
                    </a>
                    
                </div>
              </div>
              <div class="overlay overlay-effect">
                <button type="button" class="close">Close</button>
                <slot name="workers">
                <div class="workers">
                 <h1 style="color: white;">MINERS</h1>
                    <ul style="overflow: auto;">
                   
                    </ul>
                    </div>
                  </slot>
              </div>
            </header>
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
