const { config } = require('../config/config');

function cacheResponse(res, seconds) {
  if (config.env !== 'dev') {
    res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}

module.exports = { cacheResponse };
