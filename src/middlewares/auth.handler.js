const boom = require('@hapi/boom');
const { config } = require('./../config/config');

function authHandler(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey !== config.apiKey) {
    next(boom.unauthorized());
  }
  next();
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      next(boom.unauthorized('Se requiere autenticación'));
    }

    const hasRole = roles.some((role) => user.role === role);
    if (!hasRole) {
      next(boom.forbidden('No tienes permisos suficientes'));
    }

    next();
  };
}

module.exports = { authHandler, checkRoles };
