import State, { Player } from '../gameState.js';
import { generateMaze, wallCoordinates, kinematics } from '../physics/body.js';
import { drawMaze, drawBall } from '../map.js';


let socketSimulator = undefined;

document.addEventListener('DOMContentLoaded', function () {

    socketSimulator = new SocketSimulator();

    let socketResponse = getSocketResponse();

    const map = getMaze();
    let GameState = new State({
        roundOver: false,
        level: 1,
        map: map,
        players: getPlayers(socketResponse),
        config: {
            mazeSize: 5,
            scale: 100,
            walls: wallCoordinates(map)
        }
    });
    GameState = updateGameState(GameState);

    let mapCanvas = getUnitMapArea();
    drawMaze(GameState.map, mapCanvas, GameState.config);


    let Gamecode = 'Gamecode'
    let qrcode = 'qrcode'
    let number = 'number'
    let image = 'image'
    let username = 'username'
    let score = 'score'
    let lobbyId = 'lobbyId'
    let hostImage = 'hostImage'
    let hostUsername = 'hostUsername'



    const render = () => {
        const app = document.getElementById('app');
        app.innerHTML = `
        <header class="header-container">
        <h1>JiroQuest</h1>
    </header>
    <main class="spectator-main-container">
        <section class="spectator-map-container">
        </section>
        <section class="spectator-game-stats-container">
            <div class="spectator-game-stats-header-container">
                <h2>Game Stats</h2>
                <p>${Gamecode}</p>
            </div >
            <div class="qr-code-container">
                ${qrcode}
            </div>
            <div class="game-stats-players-container">
                <div class="overflow-table">
                    <table class="game-stats-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${number}</td>
                                <td>
                                    <div>
                                        ${image}
                                    </div>
                                    <div>
                                        ${username}
                                    </div>
                                </td>
                                <td>${score}</td>
                            </tr>

                        </tbody>
                    </table>

                </div>
            </div>
        </section >
        <section class="spectator-active-matches-container">
            <h2>Active Matches</h2>
            <div class="overflow-table">
                <table class="active-games-table">
                    <thead>
                        <tr>
                            <th>Lobby</th>
                            <th>Host</th>
                            <th>Spectate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${lobbyId}</td>
                            <td>
                                <div>
                                    ${hostImage}
                                </div>
                                <div>
                                    ${hostUsername}
                                </div>
                            </td>
                            <td>
                                <button class="button button-primary button-tiny"
                                    data-lobby-id="${lobbyId}">Spectate</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main >
        `;

        const spectatorMapContainer = document.querySelector('.spectator-map-container');
        spectatorMapContainer.appendChild(mapCanvas);
        spectatorMapContainer.style.width = mapCanvas.width + 'px';
        spectatorMapContainer.style.height = mapCanvas.height + 'px';
    }

    window.requestAnimationFrame(() => {
        //TODO: remove this line
        socketSimulator.runPhysics(GameState);
        GameState = updateGameState(GameState);
        GameState.players.forEach(player => {
            drawBall(player, GameState.config, mapCanvas);
        });
        render();
    });
});

function getSocketResponse() {

}

function updateGameState(currentState, socketResponse) {

    //TODO: get game state from socket
    let newState = currentState

    //TODO: update game state
    newState.updateState({
        roundOver: false,
        level: 1,
        map: currentState.map,
        players: getPlayers(socketResponse),

    })


    return newState;

}

function getPlayers(socketResponse) {
    // TODO: get players from server using socketResponse
    const players = socketSimulator.getPlayers();

    return players;
}

function getMaze() {
    //TODO: get map from server
    const maze = socketSimulator.getMaze();
    // return map
    return maze;

}

function getUnitMapArea() {
    const canvas = document.createElement('canvas');
    const mapContainer = document.querySelector('.spectator-map-container');
    canvas.id = 'gameCanvas';
    canvas.height = mapContainer ? mapContainer.clientHeight : window.innerHeight * 0.9;
    canvas.width = mapContainer ? mapContainer.clientWidth : window.innerWidth * 0.5;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10;
    return canvas;
}

class SocketSimulator {
    constructor() {
    }

    runPhysics(gameState) {
        gameState.players.forEach(player => {
            kinematics(player.angles, player.ball, 0.1, gameState.config.walls, gameState.config.scale);
        })
    }

    getMaze() {
        return generateMaze(5, 5);
    }

    getPlayers() {
        return [
            new Player({
                username: 'player1',
                position: {
                    x: 0.5,
                    y: 0.5
                }
            }),
            new Player({
                username: 'player2',
                position: {
                    x: 1.5,
                    y: 0.5
                }
            }),
            new Player({
                username: 'player3',
                position: {
                    x: 2.5,
                    y: 0.5
                }
            }),
            new Player({
                username: 'player4',
                position: {
                    x: 1.5,
                    y: 1.5
                }
            }),
        ];
    }
}