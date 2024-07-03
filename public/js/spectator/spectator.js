import { State } from '../game/gameState.js';

let GameState = undefined;

document.addEventListener('DOMContentLoaded', function () {

    const map = getMap();

    let mapCanvas = 'mapCanvas'
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
            ${mapCanvas}
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
    }

    window.requestAnimationFrame(() => {
        render();
    });
});

function getGameState() {

    //TODO: get game state from socket

    if (!GameState) {
        GameState = new State();
    } else {
        GameState.updateState({
            roundOver: false,
            level: 1,
            map: getMap(),
            players: []
        });
    }

}

function getMap() {
    //TODO: get map from server

    // return map

}