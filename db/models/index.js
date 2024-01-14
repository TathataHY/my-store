const { User, USER_SCHEMA } = require('./user.model');
const { Customer, CUSTOMER_SCHEMA } = require('./customer.model');
const { Category, CATEGORY_SCHEMA } = require('./category.model');
const { Product, PRODUCT_SCHEMA } = require('./product.model');
const { Order, ORDER_SCHEMA } = require('./order.model');
const { OrderProduct, ORDER_PRODUCT_SCHEMA } = require('./order-product.model');

function setupModels(sequelize) {
  User.init(USER_SCHEMA, User.config(sequelize));
  Customer.init(CUSTOMER_SCHEMA, Customer.config(sequelize));
  Category.init(CATEGORY_SCHEMA, Category.config(sequelize));
  Product.init(PRODUCT_SCHEMA, Product.config(sequelize));
  Order.init(ORDER_SCHEMA, Order.config(sequelize));
  OrderProduct.init(ORDER_PRODUCT_SCHEMA, OrderProduct.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
}

module.exports = setupModels;
