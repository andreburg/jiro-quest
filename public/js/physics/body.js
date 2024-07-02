
export class Vector {
    constructor({x, y, z}) {
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

export class Angle{
    constructor({beta,gamma}){
        this.beta = beta;
        this.gamma = gamma;
    }
}

export class Ball{
    constructor({mass,position,velocity,acceleration,radius,colour}){
        this.mass = mass;
        this.position = new Vector(position);
        this.velocity = new Vector(velocity);
        this.acceleration = new Vector(acceleration);
        this.radius = radius;
        this.colour = colour;
    } 
}

export class Wall{
    constructor({x, y, direction}){
        this.xStart = x;
        this.yStart = y;
        this.direction = direction;
        if(this.direction === 'N'){
            this.xEnd = x + 1;
            this.yEnd = y;
        }
        if(this.direction === 'W'){
            this.xEnd = x;
            this.yEnd = y + 1;
        }
    }
}

export function kinematics(angle, ball, time, walls, scale, mapSize) {
  const g = -25;
  const maxVelocity = 1 / scale;

    // ball.acceleration.x = g * Math.sin(angle.beta*Math.PI/180);
    // ball.acceleration.y = -g * Math.sin(angle.gamma*Math.PI/180);
  ball.acceleration.y = (-g * Math.sin(angle.beta * Math.PI / 180)) * 1 / scale;
  ball.acceleration.x = (g * Math.sin(angle.gamma * Math.PI / 180)) * 1 / scale;


  //ensure ball does not go out of bounds
  let newBallPositionx = ball.position.x + ball.velocity.x * time + 0.5 * ball.acceleration.x * Math.pow(time, 2) * 1 / scale;
  if (newBallPositionx + ball.radius > mapSize || newBallPositionx < ball.radius) {
    // apply an opposite force to the ball
    ball.acceleration.x = -ball.acceleration.x;
    ball.velocity.x = -ball.velocity.x;
    ball.position.x = ball.position.x + ball.velocity.x * time + 0.5 * ball.acceleration.x * Math.pow(time, 2) * 1 / scale;
  } else {
    ball.position.x = newBallPositionx;
  }
  let newBallPositiony = ball.position.y + ball.velocity.y * time + 0.5 * ball.acceleration.y * Math.pow(time, 2) * 1 / scale;
  if (newBallPositiony + ball.radius > mapSize || newBallPositiony < ball.radius) {
    // apply an opposite force to the ball
    ball.acceleration.y = -ball.acceleration.y;
    ball.velocity.y = -ball.velocity.y;
    ball.position.y = ball.position.y + ball.velocity.y * time + 0.5 * ball.acceleration.y * Math.pow(time, 2) * 1 / scale;
  } else {
    ball.position.y = newBallPositiony;
  }

  ball.position.x = Math.min((ball.position.x + ball.velocity.x * time + 0.5 * ball.acceleration.x * Math.pow(time, 2)) * 1 / scale, mapSize);
  ball.position.y = ball.position.y + ball.velocity.y * time + 0.5 * ball.acceleration.y * Math.pow(time, 2) * 1 / scale;

  ball.velocity.x = Math.min((ball.velocity.x + ball.acceleration.x * time * 1 / scale), maxVelocity);
  ball.velocity.y = Math.min(ball.velocity.y + ball.acceleration.y * time * 1 / scale, maxVelocity);

  wallCollision(ball, walls);
}

export function collision(ball1, ball2){
    let distance = Math.sqrt(Math.pow(ball1.position.x - ball2.position.x,2) + Math.pow(ball1.position.y - ball2.position.y,2));
    if (distance <= 1){
        vfx = (ball1.mass*ball1.velocity.x + ball2.mass*ball2.velocity.x)/(ball1.mass + ball2.mass);
        vfy = (ball1.mass*ball1.velocity.y + ball2.mass*ball2.velocity.y)/(ball1.mass + ball2.mass);

        ball1.velocity.x = vfx;
        ball1.velocity.y = vfy;
        ball2.velocity.x = vfx;
        ball2.velocity.y = vfy;
    }
}

export function wallCollision(ball, walls) {
  console.log(ball);
  walls.forEach(wall => {
    if (wall.direction === 'N') {
      if (Math.abs(ball.position.y - wall.yStart) <= ball.radius && (ball.position.x >= wall.xStart && ball.position.x <= wall.xEnd)) {
        ball.velocity.y = -ball.velocity.y;
        ball.acceleration.y = -ball.acceleration.y;
        ball.position.y = ball.position.y + ball.velocity.y * 0.1 + 0.5 * ball.acceleration.y * Math.pow(0.1, 2);
      }
    }
    if (wall.direction === 'W') {
      if (Math.abs(ball.position.x - wall.xStart) <= ball.radius && (ball.position.y >= wall.yStart && ball.position.y <= wall.yEnd)) {
        ball.velocity.x = -ball.velocity.x;
        ball.acceleration.x = -ball.acceleration.x;
        ball.position.x = ball.position.x + ball.velocity.x * 0.1 + 0.5 * ball.acceleration.x * Math.pow(0.1, 2);
      }
    }
  })
}

export function wallCoordinates(maze){
  const walls = [];
  const mazeSize = maze.length;
    maze.forEach((row, y) => {
        row.forEach((cell,x) => {
            if (cell.N) {
                walls.push(new Wall({x, y, direction: 'N'}));
            }
            if (cell.W) {
                walls.push(new Wall({x, y, direction: 'W'}));
            }

          if (x === mazeSize - 1 && cell.N) {
            walls.push(new Wall({ x: x + 1, y, direction: 'N' }));
          }

          if (y === mazeSize - 1 && cell.W) {
            walls.push(new Wall({ x, y: y + 1, direction: 'W' }));
          }
        });
    })
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
        if (x > 0) edges.push({x: x, y: y, direction: 'W'}); // West edge
        if (y > 0) edges.push({x: x, y: y, direction: 'N'}); // North edge
      }
    }
  
    // Shuffle edges
    for (let i = edges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [edges[i], edges[j]] = [edges[j], edges[i]];
    }
  
    // Create maze
    const maze = Array.from({ length: height }, () => Array.from({ length: width }, () => ({
      N: true, // Wall to the North
      W: true, // Wall to the West
    })));
  
    // Connect cells
    edges.forEach(edge => {
      const {x, y, direction} = edge;
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
  
  // Example usage
  ////////////////////



function main() {

  
    const maze = generateMaze(10,10);
    let walls = wallCoordinates(maze);

    const ball = new Ball({mass: 1, position: {x: 0.5, y: 0.5, z: 0}, velocity: {x: 0, y: 0, z: 0}, acceleration: {x: 0, y: 0, z: 0}});
    const angle = new Angle({beta: -30, gamma: 30});
    for (let i = 0; i < 10; i++){
        kinematics(angle, ball, 0.1, walls);
        console.log(i)
        console.log(ball);
    }


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