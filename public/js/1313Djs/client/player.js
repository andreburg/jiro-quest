import Route from "./Routes/Route.js";
import LobbyHost from "../pages/host/lobby.js";
import RoundHost from "../pages/host/round.js";
import Client from "./client.js";
import LobbyPlayer from "../pages/player/lobby.js";
import RoundPlayer from "../pages/player/round.js";

export default class Player extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbyPlayer()),
      new Route("round", new RoundPlayer()),
    ];
  }
}
