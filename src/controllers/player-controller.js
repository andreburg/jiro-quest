const { Request, Response } = require("express");
const fs = require("fs").promises;
const path = require("path");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getPlayerPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test/player/join-game.html"));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getPlayerLobbyPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test/player/join-game.html"));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getPlayerGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/test/player/join-game.html"));
};

module.exports = {
  getPlayerPage,
  getPlayerLobbyPage,
  getPlayerGamePage,
};
