import { Player } from "./gameState.js";
// import {
//   config,
//   createUnitMapArea,
//   drawGame,
//   drawMaze,
//   gameLoop,
//   initializeGyroscope,
// } from "./map.js";
import {
  angles,
  config,
  createUnitMapArea,
  drawGame,
  drawGoal,
  drawMaze,
  gameLoop,
  initializeGyroscope,
} from "./map.js";
import { socket } from "./socket/playerSocket.js";
import * as Physics from "./physics/body.js";

let sessionState;
const kickPlayer = (username) => {
  socket.emit("kickPlayer", { username });
};

socket.on("disconnected", () => {
  window.location.pathname = "/";
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
            <div class="join-prompt vertical">
              <h1>Waiting For Players...</h1>
              <h2>${window.location.href.split("/").pop()}</h2>
            </div>
              <div class="lobby-player-list-container">
                      ${sessionState.players.map((player, i) => {
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
                                player.username !== sessionState.hostUsername
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
                    sessionState.players.find(
                      (player) => player.socketId === socket.id
                    )?.ready
                      ? ""
                      : `
                                  <button id="readyButton">Ready Up</button>
                                  `
                  }
                  ${
                    sessionState.players.every((player) => player.ready)
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
      document.querySelectorAll(".kick-player-button").forEach((kickButton) => {
        kickButton.addEventListener("click", () => {
          kickPlayer(kickButton.id.split("-")[3]);
        });
      });
      if (document.querySelector("#start-game-button"))
        document
          .querySelector("#start-game-button")
          .addEventListener("click", () => {
            socket.emit("sessionStateChange", {
              session: {
                ...sessionState,
                status: "round",
                round: sessionState.round + 1,
              },
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
      const confg = config(15);
      let walls = Physics.wallCoordinates(confg.maze);
      confg.walls = walls;

      document.querySelector("#app").innerHTML = `
      <div class="layered-canvases-container">
        <div id="unit-map-area" class="user-map-container">
        </div>
        <div id="ball-canvas-container" class="user-ball-container">
        </div>
      </div>
      <div id="live-stats-container">
      </div>
      `;

      let gameState;
      let firstRender = true;
      const mapArea = document.querySelector("#unit-map-area");
      const mapCanvas = createUnitMapArea(mapArea);
      const ballArea = document.querySelector("#ball-canvas-container");
      const ballCanvas = createUnitMapArea(ballArea);

      let players = sessionState.players.map((player, index) => {
        let startPositions = {};
        switch (index) {
          case 0:
            startPositions = { x: 0.5, y: 0.5, z: 0 };
            break;
          case 1:
            startPositions = { x: 0.5, y: confg.mazeSize - 0.5, z: 0 };
            break;
          case 2:
            startPositions = { x: confg.mazeSize - 0.5, y: 0.5, z: 0 };
            break;
          case 3:
            startPositions = {
              x: confg.mazeSize - 0.5,
              y: confg.mazeSize - 0.5,
              z: 0,
            };
            break;
          default:
            startPositions = { x: 0.5, y: 0.5, z: 0.5 };
            break;
        }
        console.log(startPositions);
        return new Player({
          username: player.username,
          position: startPositions,
        });
      });

      window.requestAnimationFrame(gameLoop(confg, players, socket));

      const updateGameStats = (gameState) => {
        // NOTE: the following code just updates the player stats
        // We can take this out if its messing with the socket or the performance
        // START: player stats
        const playerStatsContainer = document.getElementById(
          "live-stats-container"
        );
        playerStatsContainer.innerHTML = "";

        gameState.players.forEach((player) => {
          const playerStats = document.createElement("div");

          playerStats.innerHTML = `
          <div class="player-stats-container"
          style="background-color: ${player.ball.colour}"
          >
            <div class="player-stats-username">${player.username}</div>
            <div class="player-stats-score">${player.score}</div>
          </div>
          `;
          playerStatsContainer.appendChild(playerStats);
        });
        // END: player stats
      };

      socket.on("gameStateChange", ({ game }) => {
        gameState = { ...gameState, ...game };
        drawGame(ballCanvas, gameState);
        if (firstRender) {
          drawMaze(mapCanvas, gameState.config);
          drawGoal(mapCanvas, gameState.config, gameState.players[0]);
          updateGameStats(gameState);
          firstRender = false;
        }
      });

      socket.on("playerOrientationChange", ({ username, angles }) => {
        let foundUser = players.find((player) => player.username == username);
        if (foundUser) {
          foundUser.angles = angles;
        }
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
