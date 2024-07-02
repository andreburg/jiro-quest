import Session from "./lib/game/session";
import { subscribeHostEvents } from "./lib/client/socketLib";

export default class Host {
  /** @param {string} code */
  constructor(code) {
    subscribeHostEvents(this);
    /** @type {Session} */
    this.session;
  }

  /** @param {string} sessionName */
  startSession(sessionName, code) {
    this.session = new Session(this.socket, { sessionName, code });
  }

  /** @param {string} sessionName */
  endSession() {
    this.session.end();
  }
}
