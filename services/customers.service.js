const boom = require('@hapi/boom');
const database = require('../libs/sequelize');

class CustomerService {
  constructor() {
    this.database = database;
  }

  async create(data) {
    try {
      // Crear un nuevo usuario usando el modelo Customer
      const newCustomer = await this.database.models.Customer.create(data, {
        include: ['user'],
      });

      return newCustomer;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async find() {
    try {
      // Encontrar todos los usuarios usando el modelo Customer
      const customers = await this.database.models.Customer.findAll({
        include: [
          'user',
          {
            association: 'orders',
            include: ['items'],
          },
        ],
      });

      return customers;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findOne(id) {
    try {
      // Encontrar un usuario por ID usando el modelo Customer
      const customer = await this.database.models.Customer.findByPk(id, {
        include: [
          'user',
          {
            association: 'orders',
            include: ['items'],
          },
        ],
      });

      return customer;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Actualizar un usuario por ID usando el modelo Customer
      const [, updatedCustomer] = await this.database.models.Customer.update(
        changes,
        {
          where: { id },
          returning: true,
        }
      );

      return updatedCustomer[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async delete(id) {
    try {
      // Eliminar un usuario por ID usando el modelo Customer
      const deletedCustomer = await this.database.models.Customer.destroy({
        where: { id },
        returning: true,
      });

      return deletedCustomer[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = CustomerService;
