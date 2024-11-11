const boom = require('@hapi/boom');
const database = require('../libs/sequelize');
const MailService = require('./mail.service');

class OrderService {
  constructor() {
    this.database = database;
    this.mailService = new MailService();
  }

  async create(data) {
    try {
      // Crear un nuevo usuario usando el modelo Order
      const newOrder = await this.database.models.Order.create(data);

      // Obtener el correo del usuario
      const customer = await this.database.models.Customer.findByPk(
        data.customerId,
        {
          include: ['user'],
        }
      );

      // Enviar correo de confirmación
      await this.mailService.sendOrderConfirmation(
        customer.user.email,
        newOrder
      );

      return newOrder;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async createItem(data) {
    try {
      // Crear un nuevo usuario usando el modelo Order
      const newItem = await this.database.models.OrderProduct.create(data);

      return newItem;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async find() {
    try {
      // Encontrar todos los usuarios usando el modelo Order
      const orders = await this.database.models.Order.findAll({
        include: [
          {
            association: 'customer',
            include: ['user'],
          },
          'items',
        ],
      });

      return orders;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findOne(id) {
    try {
      // Encontrar un usuario por ID usando el modelo Order
      const order = await this.database.models.Order.findByPk(id, {
        include: [
          {
            association: 'customer',
            include: ['user'],
          },
          'items',
        ],
      });

      return order;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Actualizar un usuario por ID usando el modelo Order
      const [, updatedOrder] = await this.database.models.Order.update(
        changes,
        {
          where: { id },
          returning: true,
        }
      );

      return updatedOrder[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async delete(id) {
    try {
      // Eliminar un usuario por ID usando el modelo Order
      const deletedOrder = await this.database.models.Order.destroy({
        where: { id },
        returning: true,
      });

      return deletedOrder[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findByUser(userId) {
    try {
      const orders = await this.database.models.Order.findAll({
        where: {
          '$customer.user.id$': userId,
        },
        include: [
          {
            association: 'customer',
            include: ['user'],
          },
          'items',
        ],
      });
      return orders;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = OrderService;
