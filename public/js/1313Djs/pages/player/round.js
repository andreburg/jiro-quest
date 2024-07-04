import Page from "../page.js";
export default class RoundPlayer extends Page {
  constructor(params) {
    super(params);
  }

  sideEffects() {
    let gameState;
    let firstRender = true;
    const mapArea = document.querySelector("#unit-map-area");
    const canvas = createUnitMapArea(mapArea);

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
      drawGame(canvas, gameState);
      if (firstRender) {
        updateGameStats(gameState);
        firstRender = false;
      }
    });

    let streamDeviceOrientation = setInterval(() => {
      session.socket.emit("playerOrientationChange", angles);
    }, 100);
  }

  getHtml() {
    return `
      <div id="unit-map-area" class="user-map-container"></div>
      <div id="live-stats-container"></div>
        `;
  }
}
