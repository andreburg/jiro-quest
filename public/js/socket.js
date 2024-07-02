import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

/** @type {Socket} */
let token = window.localStorage.getItem("token");
if (window.location.pathname !== "/signin") {
  if (token) {
    socket.emit("auth", { token });
    socket.on("authorized", (payload) => {
      if (payload.error) {
        window.localStorage.setItem("token", null);
        window.location.href = "/signin";
      }
    });
  } else {
    window.location.href = "/signin";
  }
}
