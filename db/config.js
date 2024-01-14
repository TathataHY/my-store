const { config } = require('./../config/config');

const USER = encodeURIComponent(config.pgUser);
const PASSWORD = encodeURIComponent(config.pgPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.pgHost}:${config.pgPort}/${config.pgDataBase}`;

module.exports = {
  development: {
    url: URI,
    dialect: 'postgres',
  },
  production: {
    url: URI,
    dialect: 'postgres',
  },
};
