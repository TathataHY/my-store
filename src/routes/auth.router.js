const express = require('express');
const passport = require('passport');
const { signToken, verifyToken } = require('../middlewares/auth.jwt.handler');
const UserService = require('../services/user.service');
const MailService = require('../services/mail.service');
const { hashPassword } = require('../utils/password.handler');

const router = express.Router();
const userService = new UserService();
const mailService = new MailService();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const token = signToken(req.user);
      res.json({
        user: req.user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Generar token usando signToken en lugar de crypto
    const recoveryToken = signToken({
      id: user.id,
      role: user.role,
      purpose: 'password-recovery',
    });

    // Guardar token y fecha de expiración (2 horas)
    await userService.update(user.id, {
      recoveryToken,
      recoveryTokenExpires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    // Enviar email
    await mailService.sendPasswordRecovery(user.email, recoveryToken);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar token usando verifyToken
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return;
    }

    // Buscar usuario con el ID del token
    const user = await userService.findById(payload.sub);
    if (!user || user.recoveryToken !== token) {
      res.status(404).json({ message: 'Token inválido o expirado' });
      return;
    }
 
    // Hashear la nueva contraseña antes de actualizarla
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña hasheada y limpiar token
    await userService.update(user.id, {
      password: hashedPassword,
      recoveryToken: null,
      recoveryTokenExpires: null,
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
