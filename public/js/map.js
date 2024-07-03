import State, { Player } from "./gameState.js";
import * as Physics from "./physics/body.js";

export const config = (mazeSize) => ({
  mazeSize,
  ballScale: 0.33,
  cellSize: 0,
  scale: 100,
  maze: Physics.generateMaze(mazeSize, mazeSize),
});

export function createUnitMapArea(htmlElement) {
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.height = window.innerHeight * 0.9;
  canvas.width = canvas.height;
  canvas.style.border = "1px solid black";
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 10;
  htmlElement.appendChild(canvas);
  return canvas;
}

function drawRectangle(canvas) {
  const ctx = canvas.getContext("2d");
  // ctx.fillStyle = 'green';
  ctx.strokeStyle = "green";
  ctx.strokeRect(0, 0, canvas.height, canvas.height);
}

export function drawMaze(canvas, config) {
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
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
}

//Player example
const player = new Player({
  username: "player1",
  position: {
    x: 1.5,
    y: 1.5,
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

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.ball.colour;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 10;
}

export const gameLoop = (config, players, socket) => () => {
  // updating physical state in memory
  players.forEach((player) => {
    Physics.kinematics(
      player.angles,
      player.ball,
      0.1,
      config.walls,
      config.mazeSize
    );
  });

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
  const cxt = canvas.getContext("2d");
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze(canvas, config);
  players.forEach((player) => drawBall(player, config, canvas));
};

export function initializeGyroscope(socket, startButton) {
  const addDeviceOrientationListener = () => {
    // TODO: get my gyro data
    window.addEventListener(
      "deviceorientation",
      (event) => {
        socket.emit("playerOrientationChange", {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
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
