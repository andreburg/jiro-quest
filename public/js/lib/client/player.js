import { subscribePlayerEvents } from "./socketLib";

export default class Player {
  /**  @param {string} code */
  constructor(name, code) {
    this.socket = io("ws://localhost:9990");
    this.socket.emit("requestSessionJoin", { name, code });
    subscribePlayerEvents(this);
    this.session = {};
  }

  /** @param {string} code */
  leaveSession(code) {
    this.session.emit("leaveSession", { code });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  socket.emit("joinRoom", { name: "andre", code: "1090124" });
  socket.on("user-connected", (payload) => {
    console.log(`${payload.user} connected!`);
  });
});
