import Client, { session } from "./client.js";
import LobbyPlayer from "../pages/player/lobby.js";
import RoundPlayer from "../pages/player/round.js";
import Route from "../router/route.js";
import { socket } from "../../socket/playerSocket.js";

export default class Player extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbyPlayer()),
      new Route("round", new RoundPlayer()),
    ];

    socket.on("sessionStateChange", ({ session: newSession }) => {
      session.state = newSession;
      this.route();
    });
  }
}

session.socket = socket;
new Player();
