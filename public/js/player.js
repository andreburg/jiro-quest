import { Player } from "./gameState.js";
import {
  angles,
  config,
  createUnitMapArea,
  drawGame,
  drawMaze,
  gameLoop,
  initializeGyroscope,
} from "./map.js";
import { socket } from "./socket.js";
import * as Physics from "./physics/body.js";

let sessionState;
const kickPlayer = (username) => {
  socket.emit("kickPlayer", { username });
};

socket.on("disconnected", () => {
  window.location.pathname = "/join";
});

socket.on("sessionStateChange", ({ session }) => {
  console.log(session);
  sessionState = session;
  render[sessionState.status].load(sessionState);
});

const render = {
  lobby: {
    load: () => {
      document.querySelector("#app").innerHTML = `
      <div class="center-div host-page-container">
            <img src="/public/assets/brutalism/Brutalist 79.png" alt="random illustration" />
            <div class="join-prompt">
              <h1>Waiting For Host...</h1>
            </div>
              <div class="lobby-player-list-container">
                      ${sessionState.players
          .map((player, i) => {

            return `
                            <div class="lobby-player-list-item ${player.ready ? "ready" : ""}">
                              <div class="lobby-player-list-item-vertical">
                                <div class="lobby-player-list-item-username">
                                  ${player.username}
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
                  <button class="button-danger" onclick={}>Exit</button>
                  ${
                    sessionState.players.find(
                      (player) => player.socketId === socket.id
                    )?.ready
                      ? ""
                      : `
                                  <button id="readyButton">Ready Up</button>
                                  `
                  }              
              </div>
          </div>
      `;

      document.querySelectorAll(".kick-player-button").forEach((kickButton) => {
        kickButton.addEventListener("click", () => {
          kickPlayer(kickButton.id.split("-")[3]);
        });
      });

      if (document.querySelector("#readyButton"))
        initializeGyroscope(socket, document.querySelector("#readyButton"));
    },
    hidrate: () => {
      document.querySelector("#app").innerHTML = `
      <div class="center-div">
      </div>
      `;
    },
  },
  round: {
    load: () => {
      const confg = config(5);
      let walls = Physics.wallCoordinates(confg.maze);
      confg.walls = walls;
      document.querySelector("#app").innerHTML = `
      <div id="unit-map-area">
      </div>
      `;
      let gameState;
      const mapArea = document.querySelector("#unit-map-area");
      const canvas = createUnitMapArea(mapArea);

      socket.on("gameStateChange", ({ game }) => {
        gameState = { ...gameState, ...game };
        drawGame(canvas, gameState);
      });

      let streamDeviceOrientation = setInterval(() => {
        socket.emit("playerOrientationChange", angles);
      }, 100);
    },
  },
};

function gameplay(timestamp) {
  requestAnimationFrame(gameplay);
}

requestAnimationFrame(gameplay);
