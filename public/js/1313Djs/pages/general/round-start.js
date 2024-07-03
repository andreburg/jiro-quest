import Calculator from "../../Components/Calculator/Calculator.js";
import Nav from "../../Components/Nav/Nav.js";
import Page from "../Page.js";

export default class RoundStart extends Page {
  constructor(params) {
    super(params);
    this.comps.Add("nav", new Nav());
    this.comps.Add("calculator", new Calculator());
  }

  getHtml() {
    return `
            ${this.comps.Render("nav")}
            <div id="calc-page">
                ${this.comps.Render("calculator")}
            </div>
        `;
  }
}
