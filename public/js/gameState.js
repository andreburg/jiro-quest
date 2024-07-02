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
        ball
    }) {
        this.username = username;
        this.angles = {
            alpha: 0,
            gamma: 0,
            beta: 0
        };
        this.position = position
        this.velocity = {
            x: 0,
            y: 0,
            z: 0,
        };
        this.acceleration = {
            x: 0,
            y: 0,
            z: 0,
        };
        this.mass = 1;
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
        this.ball = ball;
    }

}

export class Ball {
    constructor({
        x,
        y,
    }) {
    }
}


