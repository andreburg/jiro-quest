import Page from "../page.js";

export default class RoundSpectator extends Page {
  constructor(params) {
    super(params);
  }

  getHtml() {
    return `
            <div>
                round
            </div>
        `;
  }
}
