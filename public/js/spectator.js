import {
  angles,
  config,
  createUnitMapArea,
  drawGame,
  drawMaze,
  gameLoop,
  initializeGyroscope,
} from "./map.js";
import { socket } from "./socket/spectatorSocket.js";
import * as Physics from "./physics/body.js";

let sessionState;

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
      <div class="center-div">
              <h1>Waiting For Host...</h1>
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
    },
  },
};

function gameplay(timestamp) {
  requestAnimationFrame(gameplay);
}

requestAnimationFrame(gameplay);
