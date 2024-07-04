import Components from "./components.js";

export default class Component {
  constructor(params) {
    this.comps = new Components();
  }

  sideEffects() {
    this.comps.loadComponents();
  }

  getHtml() {
    return "";
  }
}
