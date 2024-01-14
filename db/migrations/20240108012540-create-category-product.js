'use strict';

const { CATEGORY_SCHEMA, CATEGORY_TABLE } = require('../models/category.model');
const { PRODUCT_SCHEMA, PRODUCT_TABLE } = require('../models/product.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CATEGORY_TABLE, CATEGORY_SCHEMA);
    await queryInterface.createTable(PRODUCT_TABLE, PRODUCT_SCHEMA);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
  },
};
