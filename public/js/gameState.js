import { Vector, Ball } from "./physics/body.js";

export default class State {
    constructor({
        roundOver = false,
        level = 1,
        map,
        players: [],
    }) {
        this.roundOver = roundOver;
        this.level = level;
        this.map = map;
        this.players = players;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.username !== player.username);
    }

    updateState({
        roundOver,
        level,
        map,
        players
    }) {
        this.roundOver = roundOver;
        this.level = level;
        this.map = map;
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
            beta: 0
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
            }
        };
        this.ball = new Ball({mass: 1, position: position, velocity: new Vector({ x: 0, y: 0, z: 0 }), acceleration: new Vector({ x: 0, y: 0, z: 0 }), radius: 0.1, colour: generateRandomColorString()});
    }

}
function generateRandomColorString() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'grey'];
    return colors[Math.floor(Math.random() * colors.length)];
}



