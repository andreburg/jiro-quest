import State, { Player } from "./gameState.js";
import * as Physics from "./physics/body.js";

export const config = (mazeSize) => ({
  mazeSize,
  ballScale: 0.33,
  cellSize: 0,
  scale: 100,
  maze: Physics.generateMaze(mazeSize, mazeSize),
  score: 3,
});

export function createUnitMapArea(htmlElement) {
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.height = htmlElement.clientHeight;
  canvas.width = htmlElement.clientWidth;
  // canvas.height = window.innerHeight * 0.9;
  // canvas.width = canvas.height;
  canvas.style.border = "1px solid black";
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 6;
  htmlElement.appendChild(canvas);
  return canvas;
}

function drawRectangle(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "green";
  ctx.strokeRect(0, 0, canvas.height, canvas.height);
}

export function drawMaze(canvas, config) {
  const ctx = canvas.getContext("2d");
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.shadowColor = "rgba(0, 0, 0, 1)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.strokeRect(
    0,
    0,
    config.mazeSize * config.scale,
    config.mazeSize * config.scale
  );
  config.maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xPos = x;
      const yPos = y;
      if (cell.N) {
        ctx.beginPath();
        ctx.moveTo(xPos * config.scale, yPos * config.scale);
        ctx.lineTo((xPos + 1) * config.scale, yPos * config.scale);
        ctx.stroke();
      }
      if (cell.W) {
        ctx.beginPath();
        ctx.moveTo(xPos * config.scale, yPos * config.scale);
        ctx.lineTo(xPos * config.scale, (yPos + 1) * config.scale);
        ctx.stroke();
      }
    });
  });
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

//Player example
const player = new Player({
  username: "player1",
  position: {
    x: 0.5,
    y: 0.5,
    z: 0,
  },
});

export function drawBall(player, config, canvas) {
  //   const canvas = document.getElementById('gameCanvas');
  const x = player.ball.position.x * config.scale;
  const y = player.ball.position.y * config.scale;
  const ballScale = config.ballScale;
  const cellSize = config.cellSize;

  const ctx = canvas.getContext("2d");
  const radius = player.ball.radius * config.scale;

  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.ball.colour;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

export function drawGoal(canvas, config, player) {
  const x = (config.mazeSize * config.scale) / 2;
  const y = x;
  const radius = player.ball.radius * config.scale;
  const goalRadius = radius * 4;
  const mapColour = "white";

  const ctx = canvas.getContext("2d");
  cxt.clearRect(0, 0, canvas.width, canvas.height);

  const grd = ctx.createRadialGradient(x, y, radius * 1.5, x, y, goalRadius);
  grd.addColorStop(0, "black");
  grd.addColorStop(1, mapColour);

  // Draw a filled Circle
  ctx.fillStyle = grd;

  ctx.beginPath();
  ctx.arc(x, y, goalRadius, 0, 2 * Math.PI);
  ctx.fill();
}

export const gameLoop = (config, players, socket) => () => {
  // updating physical state in memory
  const a = new Physics.Angle({ alpha: 0, beta: 0, gamma: 0 });
  const time = 0.1;
  const angleW = 0.9;
  players.forEach((player) => {
    a.alpha = player.angles.alpha + a.alpha;
    a.beta = player.angles.beta + a.beta;
    a.gamma = player.angles.gamma + a.gamma;
  });
  a.alpha = a.alpha / players.length;
  a.beta = a.beta / players.length;
  players.forEach((player) => {
    player.angles.alpha =
      (angleW * a.alpha + (1 - angleW) * player.angles.alpha) *
      player.angleWeight;
    player.angles.beta =
      (angleW * a.beta + (1 - angleW) * player.angles.beta) *
      player.angleWeight;
    player.angles.gamma =
      (angleW * a.gamma + (1 - angleW) * player.angles.gamma) *
      player.angleWeight;
  });
  players.forEach((player) => {
    // console.log(player.angles)
    Physics.kinematics(
      player.angles,
      player.ball,
      time,
      config.walls,
      config.mazeSize
    );
    //     players.forEach((otherPlayer) => {
    //         Physics.collision(player.ball, otherPlayer.ball, time, config.mazeSize);
    //   })
  });
  Physics.endGame(players, config);

  const gameState = new State({
    roundOver: false,
    level: 1,
    players,
    config,
  });

  socket.emit("gameStateChange", {
    game: gameState,
  });
  window.requestAnimationFrame(gameLoop(config, players, socket));
};

export const drawGame = (canvas, gameState) => {
  const { players, config } = gameState;
  config.scale = canvas.height / config.mazeSize;
  const cxt = canvas.getContext("2d");
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  // drawMaze(canvas, config);
  // drawGoal(canvas, config, players[0]);
  players.forEach((player) => {
    if (player.angleWeight === 1) {
      drawBall(player, config, canvas);
    }
  });
};

export const angles = {
  alpha: null,
  beta: null,
  gamma: null,
};

export function initializeGyroscope(socket, startButton) {
  const addDeviceOrientationListener = () => {
    // TODO: get my gyro data
    window.addEventListener(
      "deviceorientation",
      (event) => {
        angles.alpha = event.alpha;
        angles.beta = event.beta;
        angles.gamma = event.gamma;
      },
      true
    );
  };
  // if client is iOS device show popup requesting permission to access motion and orientation data
  if (window.DeviceOrientationEvent) {
    // const startButton = document.getElementById('start');
    startButton.style.display = "block";
    startButton.onclick = () => {
      if (
        typeof DeviceMotionEvent.requestPermission === "function" ||
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              alert("Permission granted");
              addDeviceOrientationListener();
              socket.emit("playerReady", {});
            } else {
              alert("Permission denied");
              window.location.pathname = "/join";
            }
            startButton.style.display = "none";
          })
          .catch((err) => {
            window.location.pathname = "/join";
          });
      } else {
        addDeviceOrientationListener();
        socket.emit("playerReady", {});

        startButton.style.display = "none";
      }
    };
  } else {
    alert("This device does not have a gyroscope");
  }
}
// //   window.addEventListener('keydown', (event) => {
// //     if (event.key === 'ArrowUp') {
// //       player.position.y -= 10;
// //     } else if (event.key === 'ArrowDown') {
// //         player.position.y += 10;
// //         } else if (event.key === 'ArrowLeft') {
// //         player.position.x -= 10;
// //         } else if (event.key === 'ArrowRight') {
// //         player.position.x += 10;
// //     }
// //     });

//   // TODO: get my gyro data
//   window.addEventListener("deviceorientation", (event) => {
//     const absolute = event.absolute;
//     const alpha = event.alpha;
//     const beta = event.beta;
//     const gamma = event.gamma;
//     // Do stuff with the new orientation data
//     player.angles = {
//       alpha:0,
//       beta,
//       gamma
//     }
//   }, true);

//   // draw map + ball
//   gameLoop(config, maze, [player], canvas);

// });

// function gameLoop(config, maze, players, canvas) {
//   // TODO: game loop: (all) get gyro data -> (all) send gyro data -> (host) calculate new ball positions ->
//   // -> (host) send new ball positions -> (all) receive new ball positions -> (all) clear canvas -> (all) draw map + ball

//   // get gyro data
//   // Done with event listener

//   // send gyro data
//   // socket.emit('gyroData', player.angles)

//   // if player == host -> calculate new ball positions
//   players.forEach(player => {
//     Physics.kinematics(player.angles, player.ball, 0.1, config.walls);
//     // console.log(player.ball.position)

//   });

//   // if player == host -> send new ball positions

//   // all -> receive new ball positions
//   // socket.on('newBallPositions', (newBallPositions) => {
//   //     player.position = newBallPositions[player.username];
//   // })

//   // all -> clear canvas
//   const context = canvas.getContext('2d');
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   // all -> draw map + ball
// //   drawMaze(maze);
// //   drawBall(players[0], config, canvas);

//   // repeat
//   window.requestAnimationFrame(() => gameLoop(config, maze, players, canvas));
// }

// // Creates and returns the canvas
// function createMapArea() {
//   const canvas = document.createElement('canvas');
//   canvas.id = 'gameCanvas';
//   canvas.height = window.innerHeight * 0.9;
//   canvas.width = canvas.height;
// //   canvas.style.border = '1px solid black';
//   document.body.append(canvas);
//   return canvas;
// }

// function getCellSize(canvas, mapWidth) {
//   return canvas.width / mapWidth;
// }

// function scaleCanvas(scale) {
//     const canvas = document.getElementById('gameCanvas');
//   const context = canvas.getContext('2d');
//   context.scale(scale, scale);
// }
