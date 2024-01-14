'use strict';

const { CUSTOMER_SCHEMA, CUSTOMER_TABLE } = require('../models/customer.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CUSTOMER_TABLE, CUSTOMER_SCHEMA);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(CUSTOMER_TABLE);
  },
};
