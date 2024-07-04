import Page from "../page.js";

export default class LobbyPlayer extends Page {
  constructor(params) {
    super(params);
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  getHtml() {
    // return `
    //         ${this.comps.Render("nav")}
    //         <div id="calc-page">
    //             ${this.comps.Render("calculator")}
    //         </div>
    //     `;
    return `
    <div>
        lobby
    </div>
    `;
  }
}
