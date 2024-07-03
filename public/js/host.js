import { Player } from "./gameState.js";
import {
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
                    ${sessionState.players
                      .map((player, i) => {
                        return `
                        <tr>
                          <td>${i + 1}</td>
                          <td>${player.username}</td>
                          <td>${player.ready}</td>

                          <td>
                      ${
                        player.username !== sessionState.hostUsername
                          ? `                         <div class="kick-player-button" id="kick-player-button-${player.username}">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="8.5" fill="#FF6B6B" stroke="black"/>
<line x1="6" y1="9" x2="12" y2="9" stroke="black" stroke-width="2"/>
</svg>
                          </div>`
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
                  <button class="button button-danger button-medium" onclick={}>Exit</button>
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
              ${
                sessionState.players.every((player) => player.ready)
                  ? `
                <div>
                  <button class="button button-success button-medium" id="start-game-button">Start</button>
                </div>
                `
                  : ""
              }
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

      let players = sessionState.players.map(
        (player) =>
          new Player({
            username: player.username,
            position: { x: 0.5, y: 0.5, z: 0.5 },
          })
      );

      window.requestAnimationFrame(gameLoop(confg, players, socket));

      socket.on("gameStateChange", ({ game }) => {
        gameState = { ...gameState, ...game };
        drawGame(canvas, gameState);
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
