import Component from "./component.js";

export default class Components {
  constructor() {
    this.comps = [];
  }

  add(name, component) {
    this.comps.push({ name, component });
  }

  get(name) {
    let c = this.comps.find((c) => c.name == name);
    if (!c) {
      c = new Component();
    }
    return c.component;
  }

  async render(name) {
    let c = this.comps.find((c) => c.name == name);
    if (!c) {
      c = new Component();
    }
    return await c.component.getHtml();
  }

  loadComponents() {
    this.comps.forEach((c) => {
      c.component.sideEffects();
    });
  }
}
