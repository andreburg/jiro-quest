import Page from "../page.js";

export default class NotFoundPage extends Page {
  constructor(params) {
    super(params);
  }

  getHtml() {
    return `
                <div>
                    NotFound
                </div>
            `;
  }
}
