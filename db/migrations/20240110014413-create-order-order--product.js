'use strict';

const { ORDER_SCHEMA, ORDER_TABLE } = require('../models/order.model');
const {
  ORDER_PRODUCT_SCHEMA,
  ORDER_PRODUCT_TABLE,
} = require('../models/order-product.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ORDER_TABLE, ORDER_SCHEMA);
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, ORDER_PRODUCT_SCHEMA);
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ORDER_TABLE);
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  },
};
