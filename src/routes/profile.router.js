const express = require('express');

const OrderService = require('../services/order.service');
const UserService = require('../services/user.service');
const passport = require('passport');

const router = express.Router();
const service = new OrderService();
const userService = new UserService();

router.get(
  '/my-orders',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const orders = await service.findByUser(user.sub);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/my-user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userPayload = req.user;
      const user = await userService.findOne(userPayload.sub);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
