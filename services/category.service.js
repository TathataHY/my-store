const boom = require('@hapi/boom');
const database = require('../libs/sequelize');

class CategoryService {
  constructor() {
    this.database = database;
  }

  async create(data) {
    try {
      // Crear una nueva categoría usando el modelo Category
      const newCategory = await this.database.models.Category.create(data);

      return newCategory;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async find() {
    try {
      // Encontrar todas las categorías usando el modelo Category
      const categories = await this.database.models.Category.findAll({
        include: ['products'],
      });

      return categories;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findOne(id) {
    try {
      // Encontrar una categoría por ID usando el modelo Category
      const category = await this.database.models.Category.findByPk(id, {
        include: ['products'],
      });

      return category;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Actualizar una categoría por ID usando el modelo Category
      const [, updatedCategory] = await this.database.models.Category.update(
        changes,
        {
          where: { id },
          returning: true,
        }
      );

      return updatedCategory[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async delete(id) {
    try {
      // Eliminar una categoría por ID usando el modelo Category
      const deletedCategory = await this.database.models.Category.destroy({
        where: { id },
        returning: true,
      });

      return deletedCategory[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = CategoryService;
