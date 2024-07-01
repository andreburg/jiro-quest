import Session from "../game/session";
import { subscribeHostEvents } from "./socketLib";

export default class Host {
  /** @param {string} code */
  constructor(code) {
    this.socket = io("ws://localhost:9990");
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
