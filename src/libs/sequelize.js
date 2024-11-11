const { config } = require('../config/config');
const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');

const connectionString = `postgres://${config.pgUser}:${config.pgPassword}@${config.pgHost}:${config.pgPort}/${config.pgDataBase}`;

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize(connectionString, {
        dialect: 'postgres',
        // eslint-disable-next-line no-console
        logging: console.log,
      });

      setupModels(this.sequelize);

      // this.sequelize.sync();

      // Escuchar eventos de error a nivel de Sequelize
      this.sequelize.authenticate().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error en la autenticación de Sequelize:', error.message);
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  // Puedes agregar métodos adicionales según tus necesidades

  async query(query, values) {
    try {
      const result = await this.sequelize.query(query, {
        replacements: values,
      });
      return result[0];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error en la consulta Sequelize:', error.message);
      throw error;
    }
  }

  // Agrega este método para acceder a los modelos de Sequelize
  get models() {
    return this.sequelize.models;
  }
}

const databaseInstance = new Database();

module.exports = databaseInstance;
