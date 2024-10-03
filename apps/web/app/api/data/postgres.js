const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "postgres"
});

async function queryDatabase(query, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

async function insertData(data) {
  const query = 'INSERT INTO test (data) VALUES ($1) RETURNING *';
  return queryDatabase(query, [data]);
}

async function getAllData() {
  const query = 'SELECT * FROM test';
  return queryDatabase(query);
}

module.exports = {
  insertData,
  getAllData
};