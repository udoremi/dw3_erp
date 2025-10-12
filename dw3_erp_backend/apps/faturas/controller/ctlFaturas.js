const mdlFaturas = require("../model/mdlFaturas");

const getAllFaturas = (req, res) =>
  (async () => {
    let registro = await mdlFaturas.getAllFaturas();
    res.json({ status: "ok", registro: registro });
  })();

const getFaturaByID = (req, res) =>
  (async () => {
    const faturaID = parseInt(req.body.id_fatura);
    let registro = await mdlFaturas.getFaturaByID(faturaID);
    res.json({ status: "ok", registro: registro });
  })();

const insertFaturas = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlFaturas.insertFaturas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const updateFaturas = (request, res) =>
  (async () => {
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlFaturas.updateFaturas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const deleteFaturas = (request, res) =>
  (async () => {
    // A exclusão de faturas será uma "exclusão física" (hard delete)
    const registro = request.body;
    let { msg, linhasAfetadas } = await mdlFaturas.deleteFaturas(registro);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  getAllFaturas,
  getFaturaByID,
  insertFaturas,
  updateFaturas,
  deleteFaturas
};