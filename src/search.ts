export class Search extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = this.html();
  }

  html() {
    return `
        <style>
          .sbx-custom {
  display: inline-block;
  position: relative;
  width: 300px;
  height: 51px;
  white-space: nowrap;
  box-sizing: border-box;
  font-size: 14px;
}

.sbx-custom__wrapper {
  width: 100%;
  height: 100%;
}

.sbx-custom__input {
  display: inline-block;
  -webkit-transition: box-shadow .4s ease, background .4s ease;
  transition: box-shadow .4s ease, background .4s ease;
  border: 0;
  border-radius: 26px;
  box-shadow: inset 0 0 0 2px #ccc;
  background: white;
  padding: 0;
  padding-right: 41px;
  padding-left: 51px;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  white-space: normal;
  font-size: inherit;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.sbx-custom__input::-webkit-search-decoration, .sbx-custom__input::-webkit-search-cancel-button, .sbx-custom__input::-webkit-search-results-button, .sbx-custom__input::-webkit-search-results-decoration {
  display: none;
}

.sbx-custom__input:hover {
  box-shadow: inset 0 0 0 2px #b3b3b3;
}

.sbx-custom__input:focus, .sbx-custom__input:active {
  outline: 0;
  box-shadow: inset 0 0 0 2px #FF2E83;
  background: white;
}

.sbx-custom__input::-webkit-input-placeholder {
  color: #bbb;
}

.sbx-custom__input::-moz-placeholder {
  color: #bbb;
}

.sbx-custom__input:-ms-input-placeholder {
  color: #bbb;
}

.sbx-custom__input::placeholder {
  color: #bbb;
}

.sbx-custom__submit {
  position: absolute;
  top: 0;
  right: inherit;
  left: 0;
  margin: 0;
  border: 0;
  border-radius: 25px 0 0 25px;
  background-color: rgba(255, 255, 255, 0);
  padding: 0;
  width: 51px;
  height: 100%;
  vertical-align: middle;
  text-align: center;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.sbx-custom__submit::before {
  display: inline-block;
  margin-right: -4px;
  height: 100%;
  vertical-align: middle;
  content: '';
}

.sbx-custom__submit:hover, .sbx-custom__submit:active {
  cursor: pointer;
}

.sbx-custom__submit:focus {
  outline: 0;
}

.sbx-custom__submit svg {
  width: 31px;
  height: 31px;
  vertical-align: middle;
  fill: #383637;
}

.sbx-custom__reset {
  display: none;
  position: absolute;
  top: 12px;
  right: 12px;
  margin: 0;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  fill: rgba(0, 0, 0, 0.5);
}

.sbx-custom__reset:focus {
  outline: 0;
}

.sbx-custom__reset svg {
  display: block;
  margin: 4px;
  width: 19px;
  height: 19px;
}

.sbx-custom__input:valid ~ .sbx-custom__reset {
  display: block;
  -webkit-animation-name: sbx-reset-in;
          animation-name: sbx-reset-in;
  -webkit-animation-duration: .15s;
          animation-duration: .15s;
}

@-webkit-keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}

@keyframes sbx-reset-in {
  0% {
    -webkit-transform: translate3d(-20%, 0, 0);
            transform: translate3d(-20%, 0, 0);
    opacity: 0;
  }
  100% {
    -webkit-transform: none;
            transform: none;
    opacity: 1;
  }
}
        </style>
       <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
        <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-search-18" viewBox="0 0 40 40">
          <path d="M30.776 27.146l-1.32-1.32-3.63 3.632 1.32 1.32 3.63-3.632zm1.368 1.368l6.035 6.035c.39.39.4 1.017.008 1.408l-2.23 2.23c-.387.387-1.015.387-1.41-.008l-6.035-6.035 3.63-3.63zm-8.11 1.392c-2.356 1.363-5.092 2.143-8.01 2.143C7.174 32.05 0 24.873 0 16.023S7.174 0 16.024 0c8.85 0 16.025 7.174 16.025 16.024 0 2.918-.78 5.654-2.144 8.01l8.96 8.962c1.175 1.174 1.184 3.07.008 4.246l-1.632 1.632c-1.17 1.17-3.067 1.173-4.247-.007l-8.96-8.96zm-8.01.54c7.965 0 14.422-6.457 14.422-14.422 0-7.965-6.457-14.422-14.422-14.422-7.965 0-14.422 6.457-14.422 14.422 0 7.965 6.457 14.422 14.422 14.422zm0-2.403c6.638 0 12.018-5.38 12.018-12.02 0-6.636-5.38-12.017-12.018-12.017-6.637 0-12.018 5.38-12.018 12.018 0 6.638 5.38 12.02 12.018 12.02zm0-1.402c5.863 0 10.616-4.752 10.616-10.616 0-5.863-4.753-10.616-10.616-10.616-5.863 0-10.616 4.753-10.616 10.616 0 5.864 4.753 10.617 10.616 10.617z"
          fill-rule="evenodd" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" id="sbx-icon-clear-5" viewBox="0 0 20 20">
          <path d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10zm1.35-10.123l3.567 3.568-1.225 1.226-3.57-3.568-3.567 3.57-1.226-1.227 3.568-3.568-3.57-3.57 1.227-1.224 3.568 3.568 3.57-3.567 1.224 1.225-3.568 3.57zM10 18.272c4.568 0 8.272-3.704 8.272-8.272S14.568 1.728 10 1.728 1.728 5.432 1.728 10 5.432 18.272 10 18.272z"
          fill-rule="evenodd" />
        </symbol>
      </svg>

      <form novalidate="novalidate" onsubmit="return false;" class="searchbox sbx-custom">
        <div role="search" class="sbx-custom__wrapper">
          <input type="search" name="search" placeholder="Find your wallet" autocomplete="off" required="required" class="sbx-custom__input">
          <button type="submit" title="Submit your search query." class="sbx-custom__submit">
            <svg role="img" aria-label="Search">
              <use xlink:href="#sbx-icon-search-18"></use>
            </svg>
          </button>
          <button type="reset" title="Clear the search query." class="sbx-custom__reset">
            <svg role="img" aria-label="Reset">
              <use xlink:href="#sbx-icon-clear-5"></use>
            </svg>
          </button>
        </div>
      </form>
      <script type="text/javascript">
        document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {  this.parentNode.querySelector('input').focus();});
      </script>
    `;
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector("form");
    form.addEventListener("touchstart", function() {
      console.log("touched");
    }, true);
  }
}

customElements.define("x-search", Search);
