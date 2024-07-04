import Component from "../component.js";
import ActiveSession from "./active-session.js";
export default class ActiveSessionList extends Component {
  constructor({ sessionId, hostUsername }) {
    super(params);
    this.sessionId = sessionId;
    this.hostUsername = hostUsername;
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  sideEffects() {}

  async getHtml() {
    const res = await fetch("/sessions", {
      method: "GET",
    });
    const activeSessions = await res.json();
    return `
        <div class="active-session-list ${player.ready ? "ready" : ""}">
            <h1>active sessions<h1>
            <div>
            ${activeSessions
              .map(({ sessionId, session }) => {
                new ActiveSession({ sessionId, session }).getHtml();
              })
              .join("")}
            </div>
        </div>
      `;
  }
}
