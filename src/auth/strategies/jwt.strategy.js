const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');
const { config } = require('../../config/config');
const UserService = require('../../services/user.service');

const service = new UserService();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const JwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await service.findOne(payload.sub);
    if (!user) {
      return done(boom.unauthorized(), false);
    }
    delete user.dataValues.password;
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

module.exports = JwtStrategy;
