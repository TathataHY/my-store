const nodemailer = require('nodemailer');
const boom = require('@hapi/boom');
const config = require('../config/config');

class MailService {
  constructor() {
    this.createTestAccount();
  }

  async createTestAccount() {
    try {
      // Crear cuenta de prueba de Ethereal
      const testAccount = await nodemailer.createTestAccount();

      // Crear transportador reutilizable usando la cuenta de prueba SMTP
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // Guardar las credenciales para mostrar la URL del mensaje
      this.testAccount = testAccount;
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async sendOrderConfirmation(userEmail, order) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Mi Tienda 👻" <foo@example.com>',
        to: userEmail,
        subject: 'Confirmación de Orden ✅',
        html: `
          <h1>¡Gracias por tu compra!</h1>
          <p>Tu orden #${order.id} ha sido confirmada.</p>
          <h2>Detalles de la orden:</h2>
          <ul>
            ${order.items
              .map(
                (item) => `
              <li>
                ${item.product.name} - Cantidad: ${item.amount}
                - Precio: $${item.product.price}
              </li>
            `
              )
              .join('')}
          </ul>
          <p>Total: $${order.total}</p>
        `,
      });

      // URL donde se puede ver el mensaje enviado
      // eslint-disable-next-line no-console
      console.log('Vista previa URL:', nodemailer.getTestMessageUrl(info));

      return {
        accepted: info.accepted,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }

  async sendPasswordRecovery(userEmail, token) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Mi Tienda 👻" <foo@example.com>',
        to: userEmail,
        subject: 'Recuperación de Contraseña 🔑',
        html: `
          <h1>Recuperación de Contraseña</h1>
          <p>Has solicitado recuperar tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${config.frontendUrl}/recovery?token=${token}">
            Recuperar contraseña
          </a>
        `,
      });

      // URL donde se puede ver el mensaje enviado
      // eslint-disable-next-line no-console
      console.log('Vista previa URL:', nodemailer.getTestMessageUrl(info));

      return {
        accepted: info.accepted,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    } catch (error) {
      throw boom.boomify(error, { statusCode: 500 });
    }
  }
}

module.exports = MailService;
