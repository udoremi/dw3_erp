const mdlClientes = require('../model/mdlClientes');

const getAllClientes = (req, res) =>
  (async () => {
    let registro = await mdlClientes.getAllClientes();
    res.json({ status: 'ok', registro: registro });
  })();

const getAllClientesFilter = (req, res) =>
  (async () => {
    let registro = await mdlClientes.getAllClientesFilter();
    res.json({ status: 'ok', registro: registro });
  })();

const getClienteByID = (req, res) =>
  (async () => {
    const clienteID = parseInt(req.body.id_cliente);
    let registro = await mdlClientes.getClienteByID(clienteID);
    res.json({ status: 'ok', registro: registro });
  })();

const insertClientes = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.insertClientes(clienteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const updateClientes = (request, res) =>
  (async () => {
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.updateClientes(clienteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const deleteClientes = (request, res) =>
  (async () => {
    // A exclusão de clientes será uma "exclusão lógica" (soft delete)
    const clienteREG = request.body;
    let { msg, linhasAfetadas } = await mdlClientes.deleteClientes(clienteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  getAllClientes,
  getAllClientesFilter,
  getClienteByID,
  insertClientes,
  updateClientes,
  deleteClientes,
};
