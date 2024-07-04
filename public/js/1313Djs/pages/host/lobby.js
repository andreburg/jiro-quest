import { session } from "../../client/client.js";
import Page from "../page.js";
export default class LobbyHost extends Page {
  constructor(params) {
    super(params);
    // this.comps.Add("nav", new Nav());
    // this.comps.Add("calculator", new Calculator());
  }

  getHtml() {
    // return `
    //         ${this.comps.Render("nav")}
    //         <div id="calc-page">
    //             ${this.comps.Render("calculator")}
    //         </div>
    //     `;
    return `
    <div class="center-div">
        <h1>Waiting For Players...</h1>
        <table class="table">
            <thead>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>Ready</th>
            </tr>
            </thead>
            <tbody>
            ${session.state.players
              ?.map((player, i) => {
                return `
            <tr>
                <td>${i + 1}</td>
                <td>${player.username}</td>
                <td>${player.ready}</td>

                <td>
                ${
                  player.username !== session.state.hostUsername
                    ? `
                <div
                    class="kick-player-button"
                    id="kick-player-button-${player.username}"
                >
                    <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <circle cx="9" cy="9" r="8.5" fill="#FF6B6B" stroke="black" />
                    <line
                        x1="6"
                        y1="9"
                        x2="12"
                        y2="9"
                        stroke="black"
                        stroke-width="2"
                    />
                    </svg>
                </div>
                `
                    : ""
                }
                </td>
            </tr>
            `;
              })
              .join("")}
            </tbody>
        </table>
        <div>
            <button class="button button-danger button-medium" onclick="{}">
            Exit
            </button>
            ${
              session.state.players?.find(
                (player) => player.socketId === session.socket.id
              )?.ready
                ? ""
                : `
            <button id="readyButton">Ready Up</button>
            `
            }
        </div>
        ${
          session.state.players?.every((player) => player.ready)
            ? `
        <div>
            <button class="button button-success button-medium" id="start-game-button">
            Start
            </button>
        </div>
        `
            : ""
        }
    </div>
    `;
  }
}
