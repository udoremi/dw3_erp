const db = require('../../../database/databaseconfig');

const getAllClientes = async () => {
  //   return (
  //     await db.query("SELECT * FROM clientes WHERE ativo = true ORDER BY nome ASC")
  //   ).rows;
  return (
    await db.query(
      'SELECT * FROM clientes ORDER BY nome ASC',
    )
  ).rows;
};

const getClienteByID = async (clienteIDPar) => {
  return (
    await db.query(
      'SELECT * FROM clientes WHERE id_cliente = $1 AND ativo = true',
      [clienteIDPar],
    )
  ).rows;
};

const insertClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';
  try {
    linhasAfetadas = (
      await db.query(
        'INSERT INTO clientes (nome, cpf_cnpj, endereco, telefone, email, data_cadastro, ativo) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          clienteREGPar.nome,
          clienteREGPar.cpf_cnpj,
          clienteREGPar.endereco,
          clienteREGPar.telefone,
          clienteREGPar.email,
          clienteREGPar.data_cadastro,
          clienteREGPar.ativo,
        ],
      )
    ).rowCount;
  } catch (error) {
    msg = '[mdlClientes|insertClientes] ' + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const updateClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';
  try {
    linhasAfetadas = (
      await db.query(
        'UPDATE clientes SET ' +
          'nome = $2, ' +
          'cpf_cnpj = $3, ' +
          'endereco = $4, ' +
          'telefone = $5, ' +
          'email = $6, ' +
          'data_cadastro = $7, ' +
          'ativo = $8 ' +
          'WHERE id_cliente = $1',
        [
          clienteREGPar.id_cliente,
          clienteREGPar.nome,
          clienteREGPar.cpf_cnpj,
          clienteREGPar.endereco,
          clienteREGPar.telefone,
          clienteREGPar.email,
          clienteREGPar.data_cadastro,
          clienteREGPar.ativo,
        ],
      )
    ).rowCount;
  } catch (error) {
    msg = '[mdlClientes|updateClientes] ' + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const deleteClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = 'ok';
  try {
    linhasAfetadas = (
      await db.query(
        'UPDATE clientes SET ativo = false WHERE id_cliente = $1',
        [clienteREGPar.id_cliente],
      )
    ).rowCount;
  } catch (error) {
    msg = '[mdlClientes|deleteClientes] ' + error.detail;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllClientes,
  getClienteByID,
  insertClientes,
  updateClientes,
  deleteClientes,
};
