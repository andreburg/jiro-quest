import Route from "./Routes/Route.js";
import Client from "./client.js";
import LobbySpectator from "../pages/spectator/lobby.js";
import RoundSpectator from "../pages/spectator/round.js";

export default class Spectator extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbySpectator()),
      new Route("round", new RoundSpectator()),
    ];
  }
}
