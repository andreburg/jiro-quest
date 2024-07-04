import { Player } from "../../../gameState.js";
import {
  angles,
  createUnitMapArea,
  drawGame,
  drawGoal,
  drawMaze,
  gameLoop,
} from "../../../map.js";
import Page from "../page.js";
import { session, game, escapeHTML } from "../../client/client.js";
import { confg } from "../../state/config.js";

export default class RoundHost extends Page {
  constructor(params) {
    super(params);
  }

  sideEffects() {
    console.log(game);
    let firstRender = true;
    const mapArea = document.querySelector("#unit-map-area");
    const mapCanvas = createUnitMapArea(mapArea);
    const ballArea = document.querySelector("#ball-canvas-container");
    const ballCanvas = createUnitMapArea(ballArea);

    let players = session.state.players.map((player, index) => {
      let startPositions = {};
      switch (index) {
        case 0:
          startPositions = { x: 0.5, y: 0.5, z: 0 };
          break;
        case 1:
          startPositions = { x: 0.5, y: confg.config.mazeSize - 0.5, z: 0 };
          break;
        case 2:
          startPositions = { x: confg.config.mazeSize - 0.5, y: 0.5, z: 0 };
          break;
        case 3:
          startPositions = {
            x: confg.config.mazeSize - 0.5,
            y: confg.config.mazeSize - 0.5,
            z: 0,
          };
          break;
        default:
          startPositions = { x: 0.5, y: 0.5, z: 0.5 };
          break;
      }
      return new Player({
        username: player.username,
        position: startPositions,
      });
    });

    window.requestAnimationFrame(
      gameLoop(confg.config, players, session.socket)
    );

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
          <div class="player-stats-username">${escapeHTML(
            player.username
          )}</div>
          <div class="player-stats-score">${player.score}</div>
        </div>
        `;
        playerStatsContainer.appendChild(playerStats);
      });
      // END: player stats
    };

    session.socket.on("gameStateChange", ({ game: newGame }) => {
      game.state = { ...game.state, ...newGame };
      drawGame(ballCanvas, game.state);
      if (firstRender) {
        drawMaze(mapCanvas, game.state.config);
        drawGoal(mapCanvas, game.state.config, game.state.players[0]);
        firstRender = false;
      }
      updateGameStats(game.state);
      // console.log(gameState.players[0].score)
    });

    session.socket.on("playerOrientationChange", ({ username, angles }) => {
      let foundUser = players.find((player) => player.username == username);
      if (foundUser) {
        foundUser.angles = angles;
      }
    });

    let streamDeviceOrientation = setInterval(() => {
      session.socket.emit("playerOrientationChange", angles);
    }, 100);
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
