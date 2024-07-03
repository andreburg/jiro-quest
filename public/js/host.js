import { socket } from "./socket.js";

let sessionState;
const kickPlayer = (username) => {
  socket.emit("kickPlayer", { username });
};

socket.on("sessionStateChange", ({ session }) => {
  console.log(session);
  sessionState = session;
  if (sessionState.status === "round") {
  } else {
    render[sessionState.status].load(sessionState);
  }
});

const render = {
  lobby: {
    load: () => {
      document.querySelector("#app").innerHTML = `
      <div class="center-div">
              <h1>Waiting For Players...</h1>
              <table class="table">
                  <thead>
                      <tr>
                          <th>#</th>
                          <th>Username</th>
                      </tr>
                  </thead>
                  <tbody>
                    ${sessionState.players
                      .map((player, i) => {
                        return `
                        <tr>
                          <td>${i + 1}</td>
                          <td>${player.username}</td>
                          <td>
                      ${
                        player.username !== sessionState.hostUsername
                          ? `                         <div class="kick-player-button" id="kick-player-button-${player.username}">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="8.5" fill="#FF6B6B" stroke="black"/>
<line x1="6" y1="9" x2="12" y2="9" stroke="black" stroke-width="2"/>
</svg>
                          </div>`
                          : ""
                      }
              
                          </td>
                      </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
              </table>
              <div>
                  <button class="button button-danger button-medium" onclick={}>Exit</button>
                  <button class="button button-success button-medium">Start</button>
              </div>
          </div>
      `;

      document.querySelectorAll(".kick-player-button").forEach((kickButton) => {
        kickButton.addEventListener("click", () => {
          kickPlayer(kickButton.id.split("-")[3]);
        });
      });
    },
    hidrate: () => {
      document.querySelector("#app").innerHTML = `
      <div class="center-div">
              <h1>Waiting For Players...</h1>
              <table class="table">
                  <thead>
                      <tr>
                          <th>#</th>
                          <th>Username</th>
                      </tr>
                  </thead>
                  <tbody>
                    ${sessionState.players
                      .map((player, i) => {
                        return `
                        <tr>
                          <td>${i + 1}</td>
                          <td>${player.username}</td>
                          <td>             
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="8.5" fill="#FF6B6B" stroke="black"/>
<line x1="6" y1="9" x2="12" y2="9" stroke="black" stroke-width="2"/>
</svg>                          </td>
                      </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
              </table>
              <div>
                  <button class="button button-danger button-medium" onclick={}>Exit</button>
                  <button class="button button-success button-medium">Start</button>
              </div>
          </div>
      `;
    },
  },
};

function gameplay(timestamp) {
  requestAnimationFrame(gameplay);
}

requestAnimationFrame(gameplay);