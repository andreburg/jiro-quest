import Component from "../component.js";
export default class ActiveSession extends Component {
  constructor({ sessionId, session }) {
    super(params);
    this.sessionId = sessionId;
    this.session = session;
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  sideEffects() {}

  async getHtml() {
    return `
        <div class="active-session-list-item>
          <div class="active-session-list-item-vertical">
            <div class="active-session-list-item-id">
              ${this.session.sessionId}
            </div>
            <div class="lobby-player-list-item-ready">
              ${this.session.hostUsername}
            </div>
          </div>
          <div class="active-session-list-item-horizontal">
            <div class="active-session-list-item-spectate" onclick="() => {window.location.pathname = '/session/${this.sessionId}/spectate'}">Spectate</div>
            <div class="active-session-list-item-join" onclick="() => {window.location.pathname = '/session/${this.sessionId}'}">Join</div>
          <div>
        </div>

      `;
  }
}
