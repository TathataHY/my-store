const boom = require('@hapi/boom');
const database = require('../libs/sequelize');
const { Op } = require('sequelize');

class ProductsService {
  constructor() {
    this.database = database;
  }

  async create(data) {
    try {
      // Crear una nueva categoría usando el modelo Product
      const newProduct = await this.database.models.Product.create(data);

      return newProduct;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async find(query) {
    const options = {
      include: ['category'],
      where: {},
    };

    const { limit, offset } = query;

    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    const { price } = query;

    if (price) {
      options.where.price = price;
    }

    const { price_min, price_max } = query;

    if (price_min && price_max) {
      options.where.price = {
        [Op.between]: [price_min, price_max],
      };
    }

    try {
      // Encontrar todas las categorías usando el modelo Product
      const products = await this.database.models.Product.findAll(options);

      return products;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findOne(id) {
    try {
      // Encontrar una categoría por ID usando el modelo Product
      const product = await this.database.models.Product.findByPk(id, {
        include: ['category'],
      });

      return product;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Actualizar una categoría por ID usando el modelo Product
      const [, updatedProduct] = await this.database.models.Product.update(
        changes,
        {
          where: { id },
          returning: true,
        }
      );

      return updatedProduct[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async delete(id) {
    try {
      // Eliminar una categoría por ID usando el modelo Product
      const deletedProduct = await this.database.models.Product.destroy({
        where: { id },
        returning: true,
      });

      return deletedProduct[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = ProductsService;
