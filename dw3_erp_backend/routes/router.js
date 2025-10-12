const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appClientes = require("../apps/clientes/controller/ctlClientes");
const appFaturas = require("../apps/faturas/controller/ctlFaturas");

// Middleware
routerApp.use((req, res, next) => {
    next();
});

routerApp.get("/", (req, res) => {
    res.send("API Clientes e Faturas");
});

// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

//@ Rotas de Clientes
// Obs: Adicione 'appLogin.AutenticaJWT' para proteger a rota
routerApp.get("/getAllClientes", appLogin.AutenticaJWT, appClientes.getAllClientes);
routerApp.post("/getClienteByID", appLogin.AutenticaJWT, appClientes.getClienteByID);
routerApp.post("/insertClientes", appLogin.AutenticaJWT, appClientes.insertClientes);
routerApp.post("/updateClientes", appLogin.AutenticaJWT, appClientes.updateClientes);
routerApp.post("/deleteClientes", appLogin.AutenticaJWT, appClientes.deleteClientes);

//@ Rotas de Faturas
// Obs: Adicione 'appLogin.AutenticaJWT' para proteger a rota
routerApp.get("/getAllFaturas", appLogin.AutenticaJWT, appFaturas.getAllFaturas);
routerApp.post("/getFaturaByID", appLogin.AutenticaJWT, appFaturas.getFaturaByID);
routerApp.post("/insertFaturas", appLogin.AutenticaJWT, appFaturas.insertFaturas);
routerApp.post("/updateFaturas", appLogin.AutenticaJWT, appFaturas.updateFaturas);
routerApp.post("/deleteFaturas", appLogin.AutenticaJWT, appFaturas.deleteFaturas);

module.exports = routerApp;