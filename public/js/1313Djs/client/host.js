import { socket } from "../../socket/playerSocket.js";
import LobbyHost from "../pages/host/lobby.js";
import RoundHost from "../pages/host/round.js";
import Route from "../router/route.js";
import Client, { session } from "./client.js";

export default class Host extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbyHost()),
      new Route("round", new RoundHost()),
    ];

    socket.on("sessionStateChange", ({ session: newSession }) => {
      session.state = newSession;
      this.route();
    });
  }
}

session.socket = socket;
new Host();
