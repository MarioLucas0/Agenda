const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoController");

const { loginRequired } = require("./src/middlewares/middleware");

// Rotas da home
route.get("/", homeController.index);

// Rotas de login
route.get("/login", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginRequired, loginController.logout);

// Rotas de contato
route.get("/contato", loginRequired, contatoController.index);
route.post("/contato/register", loginRequired, contatoController.register);
route.get("/contato/:id", loginRequired, contatoController.edit);
route.post("/contato/edit/:id", loginRequired, contatoController.update);
route.get("/contato/delete/:id", loginRequired, contatoController.delete);

module.exports = route;
