const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const query = async (text, params) => {
  try {
    const { rows, rowCount } = await pool.query(text, params);
    console.log('Consulta ejecutada:', { text, rows: rowCount });
    return { rows, rowCount };
  } catch (err) {
    console.error('Error en la consulta:', err);
    throw err;
  }
};

// Obtiene un cliente para transacciones
const getClient = async () => {
  try {
    const client = await pool.connect();
    console.log('Cliente conectado para transacción.');
    return client;
  } catch (err) {
    console.error('Error al obtener cliente:', err);
    throw err;
  }
};

// Cierra el pool de conexiones
const closePool = async () => {
  try {
    await pool.end();
    console.log('Pool de conexiones cerrado.');
  } catch (err) {
    console.error('Error al cerrar el pool de conexiones:', err);
  }
};

module.exports = {
  query,
  getClient,
  closePool,
};
