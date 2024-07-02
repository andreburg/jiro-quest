import { Player } from "./gameState.js";

document.addEventListener('DOMContentLoaded', (event) => {
  const config = {
    framesPerSecond: 60,
    mazeSize: 3,
    ballScale: 0.33,
    cellSize: 0
  }

  const canvas = createMapArea();
  const framesPerSecond = 60;
  const mazeSize = 3;
  const maze = generateMaze(mazeSize, mazeSize);

  const cellSize = getCellSize(canvas, mazeSize)
  config.cellSize = cellSize;

  drawMaze(maze, mazeSize, cellSize);

  // TODO: function to ball object
  // Example:
  const player = new Player({
    username: 'player1',
    position: {
      x: 0,
      y: 0
    },
    ball: {
      radius: 0.33,
      color: '#ff0000'
    }
  })

  // TODO: get my gyro data
  window.addEventListener("deviceorientation", (event) => {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    // Do stuff with the new orientation data
    player.angles = {
      alpha,
      beta,
      gamma
    }
  }, true);

  // draw map + ball
  gameLoop(config, maze, player, canvas);

});

function gameLoop(config, maze, player, canvas) {
  // TODO: game loop: (all) get gyro data -> (all) send gyro data -> (host) calculate new ball positions ->
  // -> (host) send new ball positions -> (all) receive new ball positions -> (all) clear canvas -> (all) draw map + ball

  // get gyro data
  // Done with event listener

  // send gyro data
  // socket.emit('gyroData', player.angles)

  // if player == host -> calculate new ball positions

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
  drawBall(player, config, canvas);

  // repeat
  window.requestAnimationFrame(() => gameLoop(config, maze, player, canvas));
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

function getCellSize(canvas, mapWidth) {
  return canvas.width / mapWidth;
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
  const x = player.position.x;
  const y = player.position.y;
  const ballScale = config.ballScale;
  const cellSize = config.cellSize;

  const ctx = canvas.getContext('2d');
  const radius = (cellSize * ballScale) / 2

  ctx.beginPath();
  ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.ball.color;
  ctx.fill();
  ctx.closePath();

}
// generates a width * height size maze
// each grid cell in the maze has a N wall and W wall component,
// N is true if there is a north wall in the grid
// W is true if there is a west wall in the gris

function generateMaze(width, height) {
  // Initialize cells
  const cells = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(new Cell(x, y));
    }
    cells.push(row);
  }

  // Initialize edges
  const edges = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x > 0) edges.push({ x: x, y: y, direction: 'W' }); // West edge
      if (y > 0) edges.push({ x: x, y: y, direction: 'N' }); // North edge
    }
  }
  // Shuffle edges
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = edges[i];
    edges[i] = edges[j];
    edges[j] = temp;
  }

  // Create maze
  const maze = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
    N: true, // Wall to the North
    W: true, // Wall to the West
  })));

  // Connect cells
  edges.forEach(edge => {
    const { x, y, direction } = edge;
    const cell = cells[y][x];
    let neighbor;
    if (direction === 'N') neighbor = cells[y - 1][x];
    if (direction === 'W') neighbor = cells[y][x - 1];

    if (cell.find() !== neighbor.find()) {
      cell.union(neighbor);
      maze[y][x][direction] = false; // Remove wall
    }
  });

  return maze;
}
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.parent = this; // Initially, the parent is the cell itself
  }

  // Find the root parent of the cell
  find() {
    if (this.parent === this) return this;
    this.parent = this.parent.find(); // Path compression
    return this.parent;
  }

  // Union two sets of cells
  union(cell) {
    const rootA = this.find();
    const rootB = cell.find();
    if (rootA !== rootB) {
      rootA.parent = rootB; // Connect the two cells
    }
  }
}


