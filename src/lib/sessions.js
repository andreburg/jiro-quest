/** @type {Map<string, { hostUsername: string, status: string, round: int, players: [{socketId: string, username: string, score: number, ready: Boolean}] }>} */
let sessions = new Map();

const getUserSession = (username) => {
  for (const [key, value] of sessions.entries()) {
    if (value.players.map((p) => p.username).includes(username)) {
      return key;
    }
  }
  return null;
};

module.exports = { sessions, getUserSession };
