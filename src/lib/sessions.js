/** @type {Map<string, { hostUsername: string, sessionName: string, status: string, playerUsernames: [string] }>} */
let sessions = new Map();

const getUserSession = (username) => {
  for (const [key, value] of users.entries()) {
    if (value.playerUsernames.includes(username)) {
      return key;
    }
  }
  return null;
};

module.exports = { sessions, getUserSession };
