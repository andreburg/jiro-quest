const { Request, Response } = require("express");
const { get } = require("http");
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
const getGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/player/game.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getSpectatorPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/spectator/index.html"));
};

module.exports = {
  getHomePage,
  getGamePage,
  getSpectatorPage
};
