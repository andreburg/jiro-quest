import Client, { session } from "./client.js";
import LobbySpectator from "../pages/spectator/lobby.js";
import RoundSpectator from "../pages/spectator/round.js";
import { socket } from "../../socket/spectatorSocket.js";
import Route from "../router/route.js";

export default class Spectator extends Client {
  constructor() {
    super();
    this.router.routes = [
      ...this.router.routes,
      new Route("lobby", new LobbySpectator()),
      new Route("round", new RoundSpectator()),
    ];

    socket.on("sessionStateChange", ({ session: newSession }) => {
      session.state = newSession;
      this.route();
    });

    socket.on("disconnected", () => {
      window.location.pathname = "/";
    });
  }
}

session.socket = socket;
new Spectator();
