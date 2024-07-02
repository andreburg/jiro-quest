console.log("map.js loaded")

document.addEventListener('DOMContentLoaded', (event) => {
    canvas=createMapArea();
    cellSize=cellSizeFix(canvas);
    // drawGrid(cellSize,canvas);
    const maze = generateMaze(3, 3);
    console.log(maze);
    drawMaze(maze);
    walls=wallCoordinates(maze);
});

cellSize = 50;


function createMapArea() {
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = window.innerWidth*0.9;
    canvas.height = window.innerHeight*0.9;
    canvas.style.border = '1px solid black';
    document.body.append(canvas);
    return canvas;
}

function cellSizeFix(canvas) {
    cellSize = canvas.width / Math.round(canvas.width / cellSize);
    return cellSize;
}


// function drawGrid(cellSize, canvas) {
//     const context = canvas.getContext('2d');

//     cols = (canvas.width / cellSize);
//     rows = (canvas.height / cellSize);

//     for (let x = 0; x <= cols; x++) {
//         context.beginPath();
//         context.moveTo(x*cellSize , 0);
//         context.lineTo(x*cellSize, rows*cellSize );
//         context.lineWidth = 5;
//         context.stroke();
//     }

//     for (let y = 0; y <= rows; y++) {
//         context.beginPath();
//         context.moveTo(0, y*cellSize );
//         context.lineTo(cols*cellSize , y*cellSize );
//         context.lineWidth = 5;
//         context.stroke();
//     }

// }

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
        if (x > 0) edges.push({x: x, y: y, direction: 'W'}); // West edge
        if (y > 0) edges.push({x: x, y: y, direction: 'N'}); // North edge
      }
    }
    console.log(edges)
    // Shuffle edges
    for (let i = edges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      temp = edges[i];
      edges[i] = edges[j];
      edges[j] = temp;
    }
    console.log(edges)
  
    // Create maze
    const maze = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
      N: true, // Wall to the North
      W: true, // Wall to the West
    })));
    // console.log(maze)
  
    // Connect cells
    edges.forEach(edge => {
        console.log(edge)
      const {x, y, direction} = edge;
      const cell = cells[y][x];
      console.log(cell)
      let neighbor;
      if (direction === 'N') neighbor = cells[y - 1][x];
      if (direction === 'W') neighbor = cells[y][x - 1];
      console.log(neighbor)
  
      if (cell.find() !== neighbor.find()) {
        cell.union(neighbor);
        maze[y][x][direction] = false; // Remove wall
      }
    });
  
    return maze;
  }
  
  // Example usage
//   const maze = generateMaze(3, 3);
//   console.log(maze);

class Wall {
    constructor(x, y, direction) {
      this.xStart = x;
      this.yStart = y;
      this.direction = direction;
      if (this.direction === 'N') {
        this.xEnd = x + 1;
        this.yEnd = y;
       }
       if (this.direction === 'W') {
        this.xEnd = x;
        this.yEnd = y + 1;
   }
    }

}

  function wallCoordinates(maze){
    const walls = [];
    maze.forEach((row, y) => {
        row.forEach((cell,x) => {
            if (cell.N) {
                walls.push(new Wall(x, y, 'N'));
            }
            if (cell.W) {
                walls.push(new Wall(x, y, 'W'));
            }
        });
    })
    console.log(walls)
    return walls;

  }
  
//   drawMaze(maze);
  function drawMaze(maze) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas.getContext) return;
  
    const ctx = canvas.getContext('2d');
    // const cellSize = 20; // Size of each cell in the maze
  
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;
  
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
  


