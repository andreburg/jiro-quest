import { Player } from "./gameState.js";
import * as Physics from "./physics/body.js";
let scale = 100;
document.addEventListener('DOMContentLoaded', (event) => {
  const config = {
    mazeSize: 3,
    ballScale: 0.33,
    cellSize: 0
  }

  const mazeSize = config.mazeSize;

//   const canvas = createMapArea(mazeSize);
  const canvas = createUnitMapArea(mazeSize, scale);
    // scaleCanvas(1);
    

  //TODO: make sure host generates maze
  const maze = Physics.generateMaze(mazeSize, mazeSize);
  const walls = Physics.wallCoordinates(maze);
  config.walls = walls;

  const cellSize = getCellSize(canvas, mazeSize)
  config.cellSize = cellSize;

  drawMaze(maze, mazeSize, cellSize);

  // TODO: function to ball object
  // Example:
  const player = new Player({
    username: 'player1',
    position: {
      x: (1.1) * scale / cellSize,
      y: (1.1) * scale / cellSize,
      z: 0
    },
    // ball: {
    //   radius: 0.33,
    //   color: '#ff0000'
    // }
  })
//   window.addEventListener('keydown', (event) => {
//     if (event.key === 'ArrowUp') {
//       player.position.y -= 10;
  //     } else if (event.key === 'ArrowDown') {
//         player.position.y += 10;
//         } else if (event.key === 'ArrowLeft') {
//         player.position.x -= 10;
//         } else if (event.key === 'ArrowRight') {
//         player.position.x += 10;
//     }
//     });

  const addDeviceOrientationListener = () => {
    // TODO: get my gyro data
    window.addEventListener("deviceorientation", (event) => {
      const absolute = event.absolute;
      const alpha = event.alpha;
      const beta = event.beta;
      const gamma = event.gamma;
      // Do stuff with the new orientation data
      player.angles = {
        alpha: 0,
        beta,
        gamma
      }
    }, true);
  }
  // if client is iOS device show popup requesting permission to access motion and orientation data
  if (window.DeviceOrientationEvent) {
    const startButton = document.getElementById('start');
    startButton.style.display = 'block';
    startButton.onclick = () => {
      if (typeof DeviceMotionEvent.requestPermission === 'function' || typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              alert('Permission granted');
              addDeviceOrientationListener();
            } else {
              alert('Permission denied');
            }
            startButton.style.display = 'none';
          })
          .catch(console.error);
      } else {
        addDeviceOrientationListener();
        startButton.style.display = 'none';
      }
    }
  } else {
    alert('This device does not have a gyroscope');
  }

  // draw map + ball
  gameLoop(config, maze, [player], canvas);

});


function gameLoop(config, maze, players, canvas) {
  // TODO: game loop: (all) get gyro data -> (all) send gyro data -> (host) calculate new ball positions ->
  // -> (host) send new ball positions -> (all) receive new ball positions -> (all) clear canvas -> (all) draw map + ball

  // get gyro data
  // Done with event listener

  // send gyro data
  // socket.emit('gyroData', player.angles)

  // if player == host -> calculate new ball positions
  players.forEach(player => {
    Physics.kinematics(player.angles, player.ball, 1, config.walls, scale, config.mazeSize);
  });


  // if player == host -> send new ball positions

  // all -> receive new ball positions
  // socket.on('newBallPositions', (newBallPositions) => {
  //     player.position = newBallPositions[player.username];
  // })

  // all -> clear canvas
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  // all -> draw map + ball
  drawMaze(maze, config.mazeSize, config.cellSize);
  drawBall(players[0], config, canvas);

  // repeat
  window.requestAnimationFrame(() => gameLoop(config, maze, players, canvas));
}

// Creates and returns the canvas
function createMapArea() {
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.height = window.innerHeight * 0.9;
  canvas.width = canvas.height;
  canvas.style.border = '1px solid black';
  document.body.append(canvas);
  return canvas;
}

function createUnitMapArea(mapSize, scale) {
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
  canvas.height = mapSize * scale;
  canvas.width = mapSize * scale;
    // canvas.style.border = '1px solid black';
    document.body.append(canvas);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'red';
    ctx.strokeRect(100, 100, 200, 200);
    ctx.strokeStyle = 'black';
    return canvas;
}

function getCellSize(canvas, mapWidth) {
  return canvas.width / mapWidth;
}

function scaleCanvas(scale) {
    const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  context.scale(scale, scale);
}

// render the maze on the canvas
function drawMaze(maze, size, cellSize) {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  // const cellSize = cellSizeFix(canvas, 200); // Size of each cell in the maze
  // canvas.width = maze[0].length * cellSize;
  // canvas.height = maze.length * cellSize;

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xPos = x * cellSize;
      const yPos = y * cellSize;

      // Draw North wall
      if (cell.N) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos + cellSize, yPos);
        ctx.stroke();
      }

      // Draw West wall
      if (cell.W) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yPos + cellSize);
        ctx.stroke();
      }
    });
  });
}

function drawBall(player, config, canvas) {
  const ballScale = config.ballScale;
  const cellSize = config.cellSize;

  const ctx = canvas.getContext('2d');
  const radius = (cellSize * ballScale) / 2
  const x = (player.ball.position.x * scale);
  const y = (player.ball.position.y * scale);

  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.ball.color;
  ctx.fill();
  ctx.closePath();

}




