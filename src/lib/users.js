const users = new Map();

const getUsername = (socketId) => {
  for (const [key, value] of users.entries()) {
    if (value === socketId) {
      return key;
    }
  }
  return null;
};

module.exports = { users, getUsername };
