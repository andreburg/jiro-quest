export class Vector {
  constructor({ x = 0.5, y = 0.5, z = 0 }) {
    this.x = x;
    this.y = y;
    this.z = z;
    // this.r = Vector.getMagnitude({
    //     x: this.x,
    //     y: this.y,
    //     z: this.z
    // });

    // this.alpha = Math.acos(this.x / this.r);
    // this.beta = Math.acos(this.y / this.r);
    // this.gamma = Math.acos(this.z / this.r);
  }
  // static getMagnitude({ x, y, z }) {
  //     return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  // }

  // static getPosition({
  //     magnitude,
  //     gamma,
  //     beta,
  //     alpha
  // }) {
  //     return ({
  //         x: magnitude * Math.cos(alpha),
  //         y: magnitude * Math.cos(beta),
  //         z: magnitude * Math.cost(gamma)
  //     })
  // }

  // static getAngles({
  //     x,
  //     y,
  //     z
  // }) {
  //     r = this.getMagnitude({ x, y, z });
  //     return ({
  //         r,
  //         alpha: Math.acos(x / r),
  //         beta: Math.acos(y / r),
  //         gamma: Math.acos(z / r),
  //     })
  // }

  // static sumVectors(vectorA, vectorB) {
  //     return new Vector({
  //         x: vectorA.x + vectorB.x,
  //         y: vectorA.y + vectorB.y,
  //         z: vectorA.z + vectorB.z,
  //     })
  // }

  // static scalarMultiply({
  //     scalar,
  //     vector
  // }) {
  //     return new Vector({
  //         x: scalar * vector.x,
  //         y: scalar * vector.y,
  //         z: scalar * vector.z,
  //     })
  // }

  // static slopedVector({
  //     vector,
  //     gamma,
  //     beta,
  //     alpha
  // }) {
  //     const r = Vector.getMagnitude({
  //         x: vector.x,
  //         y: vector.y,
  //         z: vector.z
  //     })

  //     return new Vector({
  //         x: r * Math.cos(alpha ?? vector.alpha),
  //         y: r * Math.cos(beta ?? vector.beta),
  //         z: r * Math.cos(gamma ?? vector.gamma)
  //     })
  // }

  // toString() {
  //     return `Vector: <x:${this.x}, y:${this.y}, z:${this.z}>`
  // };
}

export class Angle {
  constructor({ beta, gamma }) {
    this.beta = beta;
    this.gamma = gamma;
    this.alpha =0;
  }
}

export class Ball {
  constructor({ mass, position, velocity, acceleration, radius, colour }) {
    this.mass = mass;
    this.position = new Vector(position);
    this.velocity = new Vector(velocity);
    this.acceleration = new Vector(acceleration);
    this.radius = radius;
    this.colour = colour;
  }
}

export class Wall {
  constructor({ x, y, direction }) {
    this.xStart = x;
    this.yStart = y;
    this.direction = direction;
    if (this.direction === "N") {
      this.xEnd = x + 1;
      this.yEnd = y;
    }
    if (this.direction === "W") {
      this.xEnd = x;
      this.yEnd = y + 1;
    }
  }
}

export function kinematics(angle, ball, time, walls, mapsize) {
//   console.log(players.length);
  const g = -1;
  const rebounce = 0.5;
  const initialPosition = [ball.position.x, ball.position.y];
  const init = ball;

  // ball.acceleration.x = g * Math.sin(angle.beta*Math.PI/180);
  // ball.acceleration.y = -g * Math.sin(angle.gamma*Math.PI/180);
  ball.acceleration.y = -g * Math.sin((angle.beta * Math.PI) / 180);
  ball.acceleration.x = -g * Math.sin((angle.gamma * Math.PI) / 180);

  ball.velocity.x = ball.velocity.x + ball.acceleration.x * time;
  ball.velocity.y = ball.velocity.y + ball.acceleration.y * time;

  const newX =
    ball.position.x +
    ball.velocity.x * time +
    0.5 * ball.acceleration.x * Math.pow(time, 2);
  const newY =
    ball.position.y +
    ball.velocity.y * time +
    0.5 * ball.acceleration.y * Math.pow(time, 2);

  if (newX + ball.radius > mapsize || newX - ball.radius < 0) {
    ball.velocity.x = -ball.velocity.x * rebounce;
    ball.acceleration.x = -ball.acceleration.x;
    ball.position.x =
      ball.position.x +
      ball.velocity.x * time +
      0.5 * ball.acceleration.x * Math.pow(time, 2);
  } else ball.position.x = newX;

  if (newY + ball.radius > mapsize || newY - ball.radius < 0) {
    ball.velocity.y = -ball.velocity.y * rebounce;
    ball.acceleration.y = -ball.acceleration.y;
    ball.position.y =
      ball.position.y +
      ball.velocity.y * time +
      0.5 * ball.acceleration.y * Math.pow(time, 2);
  } else ball.position.y = newY;

  wallCollision(init, walls, time, rebounce, initialPosition);
//   if(players.length>=2){collision(ball, players);}
  
}

export function collision(ball1, ball2,time,mapsize) {
    const rebounce = 0.5;

    let distance = Math.sqrt(
        Math.pow(ball1.position.x - ball2.position.x, 2) +
        Math.pow(ball1.position.y - ball2.position.y, 2)
      );
  console.log(distance,ball1.position.x,ball1.position.y,ball2.position.x,ball2.position.y)
  if ((distance <= 2*ball1.radius)&&(distance!=0)) {
    

    ball1.velocity.x = ((ball1.mass-ball2.mass)*ball1.velocity.x + 2*ball2.mass*ball2.velocity.x)/(ball1.mass+ball2.mass);
    ball1.velocity.y = ((ball1.mass-ball2.mass)*ball1.velocity.y + 2*ball2.mass*ball2.velocity.y)/(ball1.mass+ball2.mass);

    ball2.velocity.x = ((ball2.mass-ball1.mass)*ball2.velocity.x + 2*ball1.mass*ball1.velocity.x)/(ball1.mass+ball2.mass);
    ball2.velocity.y = ((ball2.mass-ball1.mass)*ball2.velocity.y + 2*ball1.mass*ball1.velocity.y)/(ball1.mass+ball2.mass);

    const ball1X = ball1.position.x + ball1.velocity.x*time + 0.5*ball1.acceleration.x*Math.pow(time,2);
    const ball1Y = ball1.position.y + ball1.velocity.y*time + 0.5*ball1.acceleration.y*Math.pow(time,2);

    const ball2X = ball2.position.x + ball2.velocity.x*time + 0.5*ball2.acceleration.x*Math.pow(time,2);
    const ball2Y = ball2.position.y + ball2.velocity.y*time + 0.5*ball2.acceleration.y*Math.pow(time,2);

    let d2 = Math.sqrt(Math.pow(ball1X - ball2X, 2) + Math.pow(ball1Y - ball2Y, 2));

    if(d2>2*ball1.radius){
        ball1.position.x = ball1X;
        ball1.position.y = ball1Y;

        ball2.position.x = ball2X;
        ball2.position.y = ball2Y;
    }else{
        let tx = ball1.position.x;
        let ty = ball1.position.y;
        ball1.position.x = ball2.position.x+ball1.radius;
        ball1.position.y = ball2.position.y+ball1.radius;
        ball2.position.x = tx+ball2.radius;
        ball2.position.y = ty+ball2.radius;
    }

    if (ball1X + ball1.radius > mapsize || ball1X - ball1.radius < 0) {
        ball1.velocity.x = -ball1.velocity.x * rebounce;
        ball1.acceleration.x = -ball1.acceleration.x;
        ball1.position.x =
        ball1.position.x +
        ball1.velocity.x * time +
          0.5 * ball1.acceleration.x * Math.pow(time, 2);
      } else ball1.position.x = ball1X;
    if (ball1Y + ball1.radius > mapsize || ball1Y - ball1.radius < 0) {
        ball1.velocity.y = -ball1.velocity.y * rebounce;
        ball1.acceleration.y = -ball1.acceleration.y;
        ball1.position.y =
        ball1.position.y +
        ball1.velocity.y * time +
          0.5 * ball1.acceleration.y * Math.pow(time, 2);
      } else ball1.position.y = ball1Y;
    if (ball2X + ball2.radius > mapsize || ball2X - ball2.radius < 0) {
        ball2.velocity.x = -ball2.velocity.x * rebounce;
        ball2.acceleration.x = -ball2.acceleration.x;
        ball2.position.x =
        ball2.position.x +
        ball2.velocity.x * time +
          0.5 * ball2.acceleration.x * Math.pow(time, 2);
      } else ball2.position.x = ball2X;
    if (ball2Y + ball2.radius > mapsize || ball2Y - ball2.radius < 0) {
        ball2.velocity.y = -ball2.velocity.y * rebounce;
        ball2.acceleration.y = -ball2.acceleration.y;
        ball2.position.y =
        ball2.position.y +
        ball2.velocity.y * time +
          0.5 * ball2.acceleration.y * Math.pow(time, 2);
      } else ball2.position.y = ball2Y;

    

  }
}

export function endGame(players, config) {
    players.forEach((player) => {
        console.log(player.score)
        if (Math.sqrt(Math.pow(player.ball.position.x - config.mazeSize/2, 2) + Math.pow(player.ball.position.y - config.mazeSize/2, 2)) <= 2.5*player.ball.radius) {
            // if (Math.sqrt(Math.pow(player.ball.position.x - 1/2, 2) + Math.pow(player.ball.position.y - 1/2, 2)) <= 3*player.ball.radius) {
            if(player.score===0){
            player.score = config.score;
            config.score -= 1;}
            player.angleWeight = 0;
        }})}

// export function maxDistance(pos1, pos2, wallPos){
//     let d1 = Math.abs(pos1 - wallPos);
//     let d2 = Math.abs(pos2 - wallPos);
// }

function getAboveOrBelow(ball, wall, radius) {
  if (ball < wall) {
    return true;
  } else {
    // console.log(wall,wall+radius, ball+radius)
    return false;
  }
}

// Math.abs(ball.position.y - wall.yStart)<=1.1*ball.radius && (ball.position.x - 1.1*ball.radius >= wall.xStart && ball.position.x + 1.1*ball.radius <= wall.xEnd)
export function wallCollision(ball, walls, time, rebounce, initialPosition) {
  const wallExtend = -1.06;
  walls.forEach((wall) => {
    if (wall.direction === "N") {
      if (
        Math.abs(ball.position.y - wall.yStart) <= 0.9 * ball.radius &&
        ball.position.x - wallExtend * ball.radius >= wall.xStart &&
        ball.position.x + wallExtend * ball.radius <= wall.xEnd
      ) {
        ball.velocity.y = -ball.velocity.y * rebounce;
        ball.acceleration.y = -ball.acceleration.y;

        if (getAboveOrBelow(ball.position.y, wall.yStart, ball.radius)) {
          ball.position.y =
            wall.yStart -
            ball.radius +
            ball.velocity.y * time +
            0.5 * ball.acceleration.y * Math.pow(time, 2);
        }
        if (!getAboveOrBelow(ball.position.y, wall.yStart, ball.radius)) {
          ball.position.y =
            wall.yStart +
            ball.radius +
            ball.velocity.y * time +
            0.5 * ball.acceleration.y * Math.pow(time, 2);
        }
        // ball.position.y =
        // initialPosition[1]
        // ball.position.y = ball.position.y + ball.velocity.y*time + 0.5*ball.acceleration.y*Math.pow(time,2);
      }
    }
    if (wall.direction === "W") {
      if (
        Math.abs(ball.position.x - wall.xStart) <= 0.9 * ball.radius &&
        ball.position.y - wallExtend * ball.radius >= wall.yStart &&
        ball.position.y + wallExtend * ball.radius <= wall.yEnd
      ) {
        ball.velocity.x = -ball.velocity.x * rebounce;
        ball.acceleration.x = -ball.acceleration.x;

        if (getAboveOrBelow(ball.position.x, wall.xStart, ball.radius)) {
          ball.position.x =
            wall.xStart -
            ball.radius +
            ball.velocity.x * time +
            0.5 * ball.acceleration.x * Math.pow(time, 2);
        }
        if (!getAboveOrBelow(ball.position.x, wall.xStart, ball.radius)) {
          ball.position.x =
            wall.xStart +
            ball.radius +
            ball.velocity.x * time +
            0.5 * ball.acceleration.x * Math.pow(time, 2);
        }
        // ball.position.x = initialPosition[0]
        // ball.position.x = ball.position.x + ball.velocity.x*time + 0.5*ball.acceleration.x*Math.pow(time,2);
      }
    }
  });
}

export function wallCoordinates(maze) {
  const walls = [];
  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.N) {
        walls.push(new Wall({ x, y, direction: "N" }));
      }
      if (cell.W) {
        walls.push(new Wall({ x, y, direction: "W" }));
      }
    });
  });
  return walls;
}

///////
export class Cell {
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

export function generateMaze(width, height) {
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
      if (x > 0) edges.push({ x: x, y: y, direction: "W" }); // West edge
      if (y > 0) edges.push({ x: x, y: y, direction: "N" }); // North edge
    }
  }

  // Shuffle edges
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edges[i], edges[j]] = [edges[j], edges[i]];
  }

  // Create maze
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      N: true, // Wall to the North
      W: true, // Wall to the West
    }))
  );

  // Connect cells
  edges.forEach((edge) => {
    const { x, y, direction } = edge;
    const cell = cells[y][x];
    let neighbor;
    if (direction === "N") neighbor = cells[y - 1][x];
    if (direction === "W") neighbor = cells[y][x - 1];

    if (cell.find() !== neighbor.find()) {
      cell.union(neighbor);
      maze[y][x][direction] = false; // Remove wall
    }
  });
  // console.log(maze)

  const middleTop = Math.floor(height/2);
    const middleLeft = Math.floor(width/2);
    maze[middleTop][middleLeft].N = false;
    maze[middleTop][middleLeft].W = false;
    maze[middleTop][middleLeft+1].W = false;
    maze[middleTop+1][middleLeft].N = false;

  return maze;
}

// Example usage
////////////////////

function main() {
 // Example values
let ball1 = { position: { x: 3, y: 4 } };
let ball2 = { position: { x: 6, y: 8 } };

let distance = Math.sqrt(
  Math.pow(ball1.position.x - ball2.position.x, 2) +
  Math.pow(ball1.position.y - ball2.position.y, 2)
);

console.log(distance); // Output: 5

  // let ball = new Body({
  //     position: {
  //         x: 0,
  //         y: 0,
  //         z: 20
  //     },
  //     mass: 1
  // });

  // const timeIntervals = 1

  // console.log(`Position: x:${ball.position.x} y:${ball.position.y} z:${ball.position.z}`)
  // setInterval(() => {

  //     ball.applyForce(Vector.slopedVector({
  //         vector: Body.gravityVector,
  //         beta: 30
  //     }));
  //     ball.applyAcceleration(ball.acceleration, timeIntervals);
  //     ball.applyVelocity(timeIntervals)
  //     ball.applyBounds({
  //         xMin: 0,
  //         xMax: 200,
  //         yMin: 0,
  //         yMax: 200,
  //         zMin: 0,
  //         zMax: 200
  //     })

  //     console.log(`Position: x:${ball.position.x} y:${ball.position.y} z:${ball.position.z}`)
  // }, timeIntervals * 1000);
}

main();
