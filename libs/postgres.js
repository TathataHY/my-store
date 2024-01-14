const { Pool } = require('pg');
const { config } = require('../config/config');

const connectionString = `postgres://${config.pgUser}:${config.pgPassword}@${config.pgHost}:${config.pgPort}/${config.pgDataBase}`;

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString,
      max: 20, // Número máximo de conexiones en el pool
      idleTimeoutMillis: 30000, // Tiempo máximo (en milisegundos) que una conexión puede estar inactiva antes de ser eliminada
      connectionTimeoutMillis: 2000, // Tiempo máximo (en milisegundos) para esperar una nueva conexión
    });

    // Escuchar eventos de error a nivel de pool
    this.pool.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error('Error en el pool de conexiones:', error.message);
    });
  }

  async query(query, values) {
    return this.pool
      .query(query, values)
      .then((result) => result.rows)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error en la consulta:', error.message);
        throw error;
      });
  }
}

const databaseInstance = new Database();

module.exports = databaseInstance;
