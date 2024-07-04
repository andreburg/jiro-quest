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
import { socket } from "./socket/playerSocket.js";
import * as Physics from "./physics/body.js";

let sessionState;

socket.on("disconnected", () => {
  window.location.pathname = "/join";
});

socket.on("sessionStateChange", ({ session }) => {
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
              <h1>Waiting For Host...</h1>
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
                  <button class="button-danger" onclick={}>Exit</button>
              </div>
          </div>
      `;

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

      const updateGameStats = (gameState) => {
        
        // NOTE: the following code just updates the player stats
        // We can take this out if its messing with the socket or the performance
        // START: player stats
        const playerStatsContainer = document.getElementById(
          "live-stats-container"
        );
        playerStatsContainer.innerHTML = "";

        gameState.players.forEach((player) => {
            console.log(player.score)
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
