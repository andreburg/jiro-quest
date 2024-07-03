const { Request, Response } = require("express");
const { get } = require("http");
const fs = require("fs").promises;
const path = require("path");
const { users } = require("../lib/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, generateUID } = require("../lib/utils");
const { sessions } = require("../lib/sessions");

/**
 * @param {Request} req
 * @param {Response} res
 */
const getHomePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/home.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/player/game.html"));
};
const createSession = async (req, res) => {
  const sessionId = generateUID();
  sessions.set(sessionId, {
    hostUsername: req.data?.tokenData?.username,
    status: "lobby",
    players: [],
    round: 0,
  });
  res.redirect(`/lobby/${sessionId}`);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const joinSession = async (req, res) => {
  const { sessionId } = req.params;
  if (sessions.get(sessionId)) {
    const isHost =
      sessions.get(sessionId).hostUsername === req.data?.tokenData?.username;
    res.sendFile(
      path.join(__dirname, `../views/${isHost ? "host" : "player"}/lobby.html`)
    );
  } else {
    res.sendFile(path.join(__dirname, "../views/errors/lobby-not-found.html"));
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const spectateSession = async (req, res) => {
  const { sessionId } = req.params;
  if (sessions.get(sessionId)) {
    res.sendFile(path.join(__dirname, `../views/spectator/lobby.html`));
  } else {
    res.status(404).send("Lobby not found");
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getJoinPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/join.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getSignInPage = async (req, res) => {
  if (req.data?.tokenData) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "../views/signin.html"));
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const signInUser = async (req, res) => {
  const { username } = req.body;
  if (!users.has(username)) {
    const token = jwt.sign({ username }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  }
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getSpectatorPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/spectator/index.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getLossPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/endings/lose.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getWinPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/endings/win.html"));
};

module.exports = {
  createSession,
  getJoinPage,
  getHomePage,
  getGamePage,
  getSpectatorPage,
  getSignInPage,
  signInUser,
  joinSession,
  getLossPage,
  getWinPage,
  spectateSession,
};
