import { subscribePlayerEvents } from "./lib/client/socketLib";

class Player {
  /**  @param {string} code */
  constructor(username, sessionId) {
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

const createPlayer = () => {
  /** @type {HTMLInputElement} */
  let username = document.getElementById("username");
  /** @type {HTMLInputElement} */
  let sessionId = document.getElementById("sessionId");

  if (username.value && sessionId.value) {
  }
};

const leaveSession = () => {};
