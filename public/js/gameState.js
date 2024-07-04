import { Vector, Ball } from "./physics/body.js";

export default class State {
  constructor({ roundOver, level, players, config }) {
    this.roundOver = roundOver ?? false;
    this.level = level ?? 1;
    this.map = config.maze;
    this.players = players ?? [];
    this.config = config ?? {
      mazeSize: 5,
      scale: 100,
      walls: [],
      maze: [],
    };
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p.username !== player.username);
  }

  updateState({ roundOver, level, maze, players }) {
    this.roundOver = roundOver;
    this.level = level;
    this.config.maze = maze;
    this.players = players;
  }
}

/*
 */

export class Player {
  constructor({
    username,
    position,
    // ball
  }) {
    this.username = username;
    this.angles = {
      alpha: 0,
      gamma: 0,
      beta: 0,
    };
    this.powerUps = {
      increasedMass: {
        active: false,
        defaultDuration: 5,
        remainingDuration: 0,
      },
      freezeSelf: {
        active: false,
        defaultDuration: 5,
        remainingDuration: 0,
      },
      increasedTiltWeight: {
        active: false,
        defaultDuration: 5,
        remainingDuration: 0,
      },
    };
    this.ball = new Ball({
      mass: 1,
      position: position,
      velocity: new Vector({ x: 0, y: 0, z: 0 }),
      acceleration: new Vector({ x: 0, y: 0, z: 0 }),
      radius: 0.2,
      colour: generateRandomColorString(),
    });
    this.score = 0;
    this.angleWeight = 1;
  }
}
function generateRandomColorString() {
  const colors = [
    "#FF5733", // Vibrant Red
    "#FFBD33", // Bright Yellow
    "#75FF33", // Lime Green
    "#33FF57", // Light Green
    "#33FFBD", // Aquamarine
    "#339FFF", // Sky Blue
    "#3357FF", // Bright Blue
    "#7D33FF", // Violet
    "#FF33BD", // Hot Pink
    "#FF3375"  // Coral Pink
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
