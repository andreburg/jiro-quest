import {
  angles,
  createUnitMapArea,
  drawGame,
  drawGoal,
  drawMaze,
} from "../../../map.js";
import { session } from "../../client/client.js";
import Page from "../page.js";
export default class RoundSpectator extends Page {
  constructor(params) {
    super(params);
  }

  sideEffects() {
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

    session.socket.on("gameStateChange", ({ game }) => {
      gameState = { ...gameState, ...game };
      drawGame(ballCanvas, gameState);
      if (firstRender) {
        drawMaze(mapCanvas, gameState.config);
        drawGoal(mapCanvas, gameState.config, gameState.players[0]);
        updateGameStats(gameState);
        firstRender = false;
      }
    });
  }

  async getHtml() {
    return `
      <div class="layered-canvases-container">
        <div id="unit-map-area" class="user-map-container">
        </div>
        <div id="ball-canvas-container" class="user-ball-container">
        </div>
      </div>
      <div id="live-stats-container">
      </div>
      `;
  }
}
