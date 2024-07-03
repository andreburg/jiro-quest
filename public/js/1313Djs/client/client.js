import { Router } from "express";
import Route from "../router/route";
import GameStart from "../pages/general/game-start";
import RoundStart from "../pages/general/round-start";
import RoundEnd from "../pages/general/round-end";
import GameEnd from "../pages/general/game-end";

export default class Client {
  constructor() {
    this.router = new Router([
      new Route("game-start", new GameStart()),
      new Route("game-end", new GameEnd()),
      new Route("round-start", new RoundStart()),
      new Route("round-end", new RoundEnd()),
    ]);

    this.sessionState = {
      route: "lobby",
    };

    addEventListener("DOMContentLoaded", route);
    socket.on("sessionStateChange", ({ sessionState }) => {
      this.sessionState = sessionState;
      route();
    });
  }

  route = () => {
    let route = router.LoadRoute(this.sessionState.route);
    app.innerHTML = route.comp.getHtml();
    route.comp.sideEffects();
  };
}

export const app = document.querySelector("#app");
