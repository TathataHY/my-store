'use strict';

const { USER_SCHEMA, USER_TABLE } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'role', USER_SCHEMA.role);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE, 'role');
  },
};
