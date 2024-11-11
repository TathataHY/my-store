const boom = require('@hapi/boom');
const database = require('../libs/sequelize');
const { hashPassword } = require('../utils/password.handler');

class UserService {
  constructor() {
    this.database = database;
  }

  async create(data) {
    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = await this.database.models.User.create({
        ...data,
        password: hashedPassword,
      });

      delete newUser.dataValues.password;
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

      users.forEach((user) => {
        delete user.dataValues.password;
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

      delete user.dataValues.password;
      return user;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async update(id, changes) {
    try {
      // Si se está actualizando la contraseña, encriptarla
      if (changes.password) {
        const hashedPassword = await hashPassword(changes.password);
        changes.password = hashedPassword;
      }

      const [, updatedUser] = await this.database.models.User.update(changes, {
        where: { id },
        returning: true,
      });

      delete updatedUser[0].dataValues.password;
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

      delete deletedUser[0].dataValues.password;
      return deletedUser[0];
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.database.models.User.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async findByToken(token) {
    try {
      const user = await this.database.models.User.findOne({
        where: {
          recoveryToken: token,
          recoveryTokenExpires: {
            [this.database.Sequelize.Op.gt]: new Date()
          }
        }
      });
      return user;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = UserService;
