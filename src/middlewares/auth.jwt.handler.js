const boom = require('@hapi/boom');
const { config } = require('../config/config');
const jwt = require('jsonwebtoken');

function signToken(user) {
  const payload = {
    sub: user.id,
    role: user.role,
  };
  const token = jwt.sign(payload, config.jwtSecret);
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

function checkJwtToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    next(boom.unauthorized());
  }

  try {
    const payload = verifyToken(token.split(' ')[1]); // Removemos 'Bearer '
    req.user = payload;
    next();
  } catch (error) {
    next(boom.unauthorized());
  }
}

module.exports = { signToken, checkJwtToken };
