import Page from "../page.js";
export default class LobbySpectator extends Page {
  constructor(params) {
    super(params);
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
