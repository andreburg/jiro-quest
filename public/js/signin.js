import { socket } from "./socket.js";

let token = window.localStorage.getItem("token");

async function signIn() {
  /** @type {HTMLInputElement} */
  let username = document.getElementById("username").value;
  if (username) {
    socket.emit("signIn", { username });
    socket.on("authorized", (payload) => {
      window.localStorage.setItem("token", payload);
      console.log(window.localStorage.getItem("token"));
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLButtonElement} */
  document
    .querySelector("#confirm-username-button")
    .addEventListener("click", signIn);
});
