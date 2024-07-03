import Route from "./Routes/Route.js";
import LobbyHost from "../pages/host/lobby.js";
import RoundHost from "../pages/host/round.js";
import Client from "./client.js";

export default class Host extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbyHost()),
      new Route("round", new RoundHost()),
    ];
  }
}
