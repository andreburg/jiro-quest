import { Socket } from "socket.io";
import Player from "../../player";
import Host from "../../host";

/** @param {Player} player */
export const subscribePlayerEvents = (player) => {
  subscribeClientEvents(player.socket);

  player.socket.on("sessionConnected");
};

/** @param {Host} host */
export const subscribeHostEvents = (host) => {
  subscribeClientEvents(host.socket);

  host.socket.on("playerLeave", onPlayerLeave(host));
  host.socket.on("requestSessionJoin", onRequestSessionJoin(host));
};

/** @param {Socket} socket */
export const subscribeClientEvents = (socket) => {};

/** @param {Host} host @returns {(payload: Object) => void} */
const onPlayerLeave = (host) => (payload) => {
  host.session.removePlayer(payload.sessionId);
};

/** @param {Host} host @returns {(payload: Object) => void} */
const onRequestSessionJoin = (host) => (payload) => {
  host.session.addPlayer(...payload);
};
