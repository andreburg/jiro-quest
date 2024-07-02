const { Request, Response } = require("express");
const fs = require("fs").promises;
const path = require("path");

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
const getJoinGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/player/join-game.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getCreateGame = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/host/create-game.html"));
};


module.exports = {
  getHomePage,
  getJoinGamePage,
  getCreateGame
};
