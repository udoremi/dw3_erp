const db = require("../../../database/databaseconfig");

const getAllFaturas = async () => {
  return (
    await db.query(
      "SELECT f.*, c.nome as nome_cliente " +
      "FROM faturas f " +
      "INNER JOIN clientes c ON f.id_cliente = c.id_cliente " +
      "ORDER BY f.data_vencimento ASC"
    )
  ).rows;
};

const getFaturaByID = async (faturaIDPar) => {
  return (
    await db.query(
      "SELECT f.*, c.nome as nome_cliente " +
      "FROM faturas f " +
      "INNER JOIN clientes c ON f.id_cliente = c.id_cliente " +
      "WHERE f.id_fatura = $1",
      [faturaIDPar]
    )
  ).rows;
};

const insertFaturas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO faturas (id_cliente, data_emissao, data_vencimento, valor_total, status) " +
        "VALUES ($1, $2, $3, $4, $5)",
        [
          registroPar.id_cliente,
          registroPar.data_emissao,
          registroPar.data_vencimento,
          registroPar.valor_total,
          registroPar.status,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFaturas|insertFaturas] " + error.message;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const updateFaturas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE faturas SET " +
          "id_cliente = $2, " +
          "data_emissao = $3, " +
          "data_vencimento = $4, " +
          "valor_total = $5, " +
          "status = $6 " +
          "WHERE id_fatura = $1",
        [
          registroPar.id_fatura,
          registroPar.id_cliente,
          registroPar.data_emissao,
          registroPar.data_vencimento,
          registroPar.valor_total,
          registroPar.status,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFaturas|updateFaturas] " + error.message;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const deleteFaturas = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "DELETE FROM faturas WHERE id_fatura = $1",
        [registroPar.id_fatura]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlFaturas|deleteFaturas] " + error.message;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

module.exports = {
  getAllFaturas,
  getFaturaByID,
  insertFaturas,
  updateFaturas,
  deleteFaturas,
};