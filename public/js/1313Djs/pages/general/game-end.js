import { escapeHTML, game, session } from "../../client/client.js";
import Page from "../page.js";

export default class GameEnd extends Page {
  constructor(params) {
    super(params);
  }

  getHtml() {
    this.username = session.state?.players?.find(
      (player) => player.socketId === session.socket.id
    )?.username;

    this.winner = game.state.players.find((player) => player.score === 3);

    console.log("you", this.username);
    console.log("winner", this.winner);

    if (this.username === this.winner.username) {
      return `
      <div class="win-background">
        <main class="center-div">
          <div class="join-prompt vertical">
            <h1>✨ You Win! 🥇</h1>
          </div>
          <div class="">
            <button class="button-large" onclick="window.location.href='/';">
              Home
            </button>
          </div>
        </main>
      </div>
        `;
    } else {
      if (this.username) {
        return `
              <div class="lose-background">
                <main class="center-div">
                  <div class="join-prompt vertical">
                    <h1>🥲 You Lose! 😭</h1>
                  </div>
                  <div class="">
                    <button class="button-large" onclick="window.location.href='/';">
                      Home
                    </button>
                  </div>
                </main>
              </div>
        `;
      } else {
        return `
        <div class="win-background">
          <main class="center-div">
            <div class="join-prompt vertical">
              <h1>✨ ${escapeHTML(this.winner.username)} Won! 🥇</h1>
            </div>
            <div class="">
              <button class="button-large" onclick="window.location.href='/';">
                Home
              </button>
            </div>
          </main>
        </div>
          `;
      }
    }
  }
}
