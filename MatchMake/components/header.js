class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div id="header">
            <div id="header-left">
                <a href="./home.html" id="logo">
                    <i class="fa-solid fa-wave-square"></i>
                    MatchMake
                </a>
            </div>
            <div id="header-right" class="nonexpanding">
                <a href="../pages/create.html">Create</a>
                <a href="../index.html" id ="logout-btn">Logout</a>
                <a href="../pages/account-settings"><i class="fa-solid fa-gear"></i></a>
            </div>
    </div>
    `;
  }
}

customElements.define('header-component', Header);