import { Player } from "./gameState.js";
import * as Physics from "./physics/body.js";

const config = {
    mazeSize: 5,
    ballScale: 0.33,
    cellSize: 0,
    scale:100
  }

document.addEventListener('DOMContentLoaded', (event) => {
  
//   const canvas = createMapArea(mazeSize);
    initializeGyroscope();
    const canvas = createUnitMapArea();
    drawRectangle(canvas);
    const maze = Physics.generateMaze(config.mazeSize, config.mazeSize);
    console.log(maze)
    const walls = Physics.wallCoordinates(maze);
    console.log(walls);
    console.log(walls);
    drawMaze(maze,canvas,config);
    drawBall(player, config,canvas);
    gameLoop(config, maze, [player], canvas, walls);

});

 
    

  //TODO: make sure host generates maze
  
//   // TODO: function to ball object


function createUnitMapArea() {
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.height = window.innerHeight * 0.9;
    canvas.width = canvas.height;
    canvas.style.border = '1px solid black';
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10;
    document.body.append(canvas);
    return canvas;
}

function drawRectangle(canvas){
    const ctx = canvas.getContext('2d');
    // ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.strokeRect(0, 0, canvas.height, canvas.height);
}

function drawMaze(maze,canvas,config){
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, config.mazeSize*config.scale, config.mazeSize*config.scale);
    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            const xPos = x ;
            const yPos = y ;
            if(cell.N){
                ctx.beginPath();
                ctx.moveTo(xPos*config.scale, yPos*config.scale);
                ctx.lineTo((xPos+1)*config.scale, yPos*config.scale);
                ctx.stroke();
            }
            if(cell.W){
                ctx.beginPath();
                ctx.moveTo(xPos*config.scale, yPos*config.scale);
                ctx.lineTo(xPos*config.scale, (yPos+1)*config.scale);
                ctx.stroke();
            }
        });
    });

}

//Player example
const player = new Player({
    username: 'player1',
    position: {
        x: 1.5,
        y: 1.5,
        z: 0
    },
});

function drawBall(player, config, canvas) {
//   const canvas = document.getElementById('gameCanvas');
  const x = player.ball.position.x*config.scale;
  const y = player.ball.position.y*config.scale;
  const ballScale = config.ballScale;
  const cellSize = config.cellSize;

  const ctx = canvas.getContext('2d');
  const radius = player.ball.radius*config.scale

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = player.ball.colour;
  ctx.fill(); 
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.lineWidth = 10;
}

function gameLoop(config, maze, players, canvas,walls) {
    players.forEach(player => {Physics.kinematics(player.angles, player.ball, 0.1, walls,config.mazeSize);});
    const cxt = canvas.getContext('2d');
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(maze,canvas,config);
    players.forEach(player => drawBall(player, config, canvas));
    window.requestAnimationFrame(() => gameLoop(config, maze, players, canvas,walls));
// TODO: add gyro data
}







function initializeGyroscope() {
    const startButton = document.createElement('button');
    startButton.id = 'start';
    startButton.innerHTML = 'Start';
    document.body.append(startButton);
    const addDeviceOrientationListener = () => {
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
            };
        }, true);
    };
    // if client is iOS device show popup requesting permission to access motion and orientation data
    if (window.DeviceOrientationEvent) {
        // const startButton = document.getElementById('start');
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
        };
    } else {
        alert('This device does not have a gyroscope');
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








