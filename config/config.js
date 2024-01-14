require('dotenv').config({ path: './config/.env' });

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  pgUser: process.env.PGUSER,
  pgPassword: process.env.PGPASSWORD,
  pgHost: process.env.PGHOST,
  pgDataBase: process.env.PGDATABASE,
  pgPort: process.env.PGPORT,
};

module.exports = { config };
