const { Request, Response } = require("express");
const fs = require("fs").promises;
const path = require("path");

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getHostPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/host/create-game.html"));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getHostLobbyPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/host/lobby.html"));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const getHostGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/host/game.html"));
};

module.exports = {
  getHostPage,
  getHostLobbyPage,
  getHostGamePage,
};
