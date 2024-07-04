import { initializeGyroscope } from "../../../map.js";
import { session } from "../../client/client.js";
import Page from "../page.js";
export default class LobbyHost extends Page {
  constructor(params) {
    super(params);
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  sideEffects() {
    document.querySelectorAll(".kick-player-button").forEach((kickButton) => {
      kickButton.addEventListener("click", () => {
        kickPlayer(kickButton.id.split("-")[3]);
      });
    });
    if (document.querySelector("#start-game-button"))
      document
        .querySelector("#start-game-button")
        .addEventListener("click", () => {
          session.socket.emit("sessionStateChange", {
            session: {
              ...session.state,
              route: "round",
              round: session.state.round + 1,
            },
          });
        });

    if (document.querySelector("#readyButton"))
      initializeGyroscope(
        session.socket,
        document.querySelector("#readyButton")
      );
  }

  getHtml() {
    return `
    <div class="center-div host-page-container">
      <img src="/public/assets/brutalism/Brutalist 79.png" alt="random illustration" />
      <div class="join-prompt vertical">
        <h1>Waiting For Players...</h1>
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
                            ${player.username}
                          </div>
                          <div class="lobby-player-list-item-ready">
                            ${player.ready ? "Ready" : "Not Ready"}
                          </div>
                        </div>
                        ${
                          player.username !== session.state.hostUsername
                            ? `                         
                      <div class="kick-player-button" id="kick-player-button-${player.username}">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="9" cy="9" r="8.5" fill="#FF6B6B" stroke="black"/>
                          <line x1="6" y1="9" x2="12" y2="9" stroke="black" stroke-width="2"/>
                        </svg>
                      </div>`
                            : ""
                        }
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
            ${
              session.state.players?.every((player) => player.ready)
                ? `
              <div>
                <button class="" id="start-game-button">Start</button>
              </div>
              `
                : ""
            }
            <button class="button-danger" onclick={}>Exit</button>
        </div>
    </div>
    `;
  }
}
