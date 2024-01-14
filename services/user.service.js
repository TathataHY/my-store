const boom = require('@hapi/boom');
const database = require('../libs/sequelize');

class UserService {
  constructor() {
    this.database = database;
  }

  async create(data) {
    try {
      // Crear un nuevo usuario usando el modelo User
      const newUser = await this.database.models.User.create(data);

      return newUser;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async find() {
    try {
      // Encontrar todos los usuarios usando el modelo User
      const users = await this.database.models.User.findAll({
        include: ['customer'],
      });

      return users;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findOne(id) {
    try {
      // Encontrar un usuario por ID usando el modelo User
      const user = await this.database.models.User.findByPk(id, {
        include: ['customer'],
      });

      return user;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Actualizar un usuario por ID usando el modelo User
      const [, updatedUser] = await this.database.models.User.update(changes, {
        where: { id },
        returning: true,
      });

      return updatedUser[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async delete(id) {
    try {
      // Eliminar un usuario por ID usando el modelo User
      const deletedUser = await this.database.models.User.destroy({
        where: { id },
        returning: true,
      });

      return deletedUser[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = UserService;
