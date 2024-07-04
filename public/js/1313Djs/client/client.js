import Route from "../router/route.js";
import GameStart from "../pages/general/game-start.js";
import RoundStart from "../pages/general/round-start.js";
import RoundEnd from "../pages/general/round-end.js";
import GameEnd from "../pages/general/game-end.js";
import Router from "../router/router.js";

export default class Client {
  constructor() {
    this.router = new Router([
      new Route("game-start", new GameStart()),
      new Route("game-end", new GameEnd()),
      new Route("round-start", new RoundStart()),
      new Route("round-end", new RoundEnd()),
    ]);

    addEventListener("DOMContentLoaded", this.route);
    this.route();
  }

  route = async () => {
    console.log(session.state);
    let route = this.router.loadRoute(session.state);
    app.innerHTML = await route.comp.getHtml();
    route.comp.sideEffects();
  };
}

export const app = document.querySelector("#app");

export const session = {
  state: {
    route: "lobby",
  },
  socket: null,
};
