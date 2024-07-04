import Page from "../page.js";

export default class GameEnd extends Page {
  constructor(params) {
    super(params);
  }

  getHtml() {
    return `
            <div id="calc-page">
            </div>
        `;
  }
}
