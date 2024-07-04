import { initializeGyroscope } from "../../../map.js";
import { escapeHTML, session } from "../../client/client.js";
import Page from "../page.js";

export default class LobbyPlayer extends Page {
  constructor(params) {
    super(params);
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  sideEffects() {
    if (document.querySelector("#readyButton"))
      initializeGyroscope(
        session.socket,
        document.querySelector("#readyButton")
      );
  }

  async getHtml() {
    return `
          <div class="center-div host-page-container">
            <img src="/public/assets/brutalism/Brutalist 79.png" alt="random illustration" />
            <div class="join-prompt vertical">
              <h1>Waiting For Host...</h1>
              <h2>${window.location.href.split("/").pop()}</h2>
            </div>
              <div class="lobby-player-list-container">
                      ${session.state.players?.map((player, i) => {
                        return `
                            <div class="lobby-player-list-item ${
                              player.ready ? "ready" : ""
                            }">
                              <div class="lobby-player-list-item-vertical">
                                <div class="lobby-player-list-item-username">
                                  ${escapeHTML(player.username)}
                                </div>
                                <div class="lobby-player-list-item-ready">
                                  ${player.ready ? "Ready" : "Not Ready"}
                                </div>
                              </div>
                          </div>

                          `;
                      })}
              </div>
              <div class="right-aligned-button-group">
                  ${
                    session.state.players?.find(
                      (player) => player.socketId === session.socket.id
                    )?.ready
                      ? ""
                      : `
                          <button id="readyButton">Ready Up</button>
                        `
                  }  
                  <button class="button-danger" onclick={}>Exit</button>
              </div>
          </div>
    `;
  }
}
