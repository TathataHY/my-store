const express = require('express');
const router = express.Router();

const ProductsServices = require('../services/product.service');
const { cacheResponse } = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS } = require('../utils/time');
const validatorHandler = require('./../middlewares/validator.handler');
const { queryProductSchema } = require('./../schemas/product.schema');

const productServices = new ProductsServices();

router.get(
  '/',
  validatorHandler(queryProductSchema, 'query'),
  async function (req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);

    try {
      const products = await productServices.find(req.query);

      res.render('products', { products });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
