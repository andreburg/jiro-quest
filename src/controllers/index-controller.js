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
const getCreatePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/create.html"));
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
  res.sendFile(path.join(__dirname, "../views/signin.html"));
};

/**
 * @param {Request} req
 * @param {Response} res
 */
const getGamePage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/player/game.html"));
};

module.exports = {
  getCreatePage,
  getJoinPage,
  getHomePage,
  getJoinPage,
  getGamePage,
};
