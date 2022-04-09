export class Search extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.html()
  }

  html() {
    return `
        <style>
          @import "assets/styles/bootstrap.css";
           .search-box {
              transition: width 0.6s, border-radius 0.6s, background 0.6s, box-shadow 0.6s;
              width: 40px;
              height: 40px;
              border-radius: 20px;
              border: none;
              cursor: pointer;
              background: #ebebeb;
            }
            .search-box + label .search-icon {
              color: black;
            }
            .search-box:hover {
              color: white;
              background: #c8c8c8;
              box-shadow: 0 0 0 5px #3d4752;
            }
            .search-box:hover + label .search-icon {
              color: white;
            }
            .search-box:focus {
              transition: width 0.6s cubic-bezier(0, 1.22, 0.66, 1.39), border-radius 0.6s, background 0.6s;
              border: none;
              outline: none;
              box-shadow: none;
              padding-left: 15px;
              cursor: text;
              width: 300px;
              border-radius: auto;
              background: #ebebeb;
              color: black;
            }
            .search-box:focus + label .search-icon {
              color: black;
            }
            .search-box:not(:focus) {
              text-indent: -5000px;
            }
            
            #search-submit {
              position: relative;
              left: -5000px;
            }
            
            .search-icon {
              position: relative;
              left: -30px;
              color: white;
              cursor: pointer;
            } 
        </style>
        <form class="search-container" action="//llamaswill.tumblr.com/search">
          <input id="search-box" type="text" class="search-box" name="q" />
          <label for="search-box"><span class="glyphicon glyphicon-search search-icon"></span></label>
          <input type="submit" id="search-submit" />
        </form>
    `
  }
  connectedCallback() {
    const form = this.shadowRoot.querySelector('form')
    form.addEventListener("touchstart", function(){
      console.log('touched')
    }, true);
  }
}

customElements.define('x-search', Search);
