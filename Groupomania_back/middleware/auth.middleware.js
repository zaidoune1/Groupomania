const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");
const UserModel = require("../models/user.model");
require("dotenv").config({ path: "./config/.env" });

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//Verification de l'existence et de la validité du token de l'utilisateur
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
      if (err) {
        res.send(200).json("no token");
      } else {
        next();
      }
    });
  } else {
    return null;
  }
};

//vérification de la condition Administrateur de l'utilisateur
module.exports.isPostAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("No Token");
  } else {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
      if (!err) {
        let user = await UserModel.findById(decodedToken.id);
        let poster = await postModel.findById(req.params.id);
        let commenterId =  await postModel.findById(req.body.commenterId);

        if (commenterId === user.id || poster.posterId === user.id || user.role === "admin") {
          res.locals.user = user;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};

module.exports.isUserAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("No Token");
  } else {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
      if (!err) {
        let requestingUser = await UserModel.findById(decodedToken.id);
        let updatingUser = await UserModel.findById(req.params.id);
        if (
          requestingUser.id === updatingUser.id ||
          requestingUser.role === "admin"
        ) {
          res.locals.user = updatingUser;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};

module.exports.isUploadAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("No Token");
  } else {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decodedToken) => {
      if (!err) {
        let requestingUser = await UserModel.findById(decodedToken.id);
        let updatingUser = await UserModel.findById(req.body.userId);
        let CommenterUser = await postModel.findById(req.params.commenterId);
        if (
          requestingUser.id === updatingUser.id ||
          requestingUser.id === CommenterUser.id ||
          requestingUser.role === "admin"
        ) {
          res.locals.user = updatingUser;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};