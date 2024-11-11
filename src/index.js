const path = require('path');
const boom = require('@hapi/boom');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const fetch = require('node-fetch');
require('./auth');

// require routes
const routerApi = require('./routes');
const setupApolloServer = require('./graphql');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());
// static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.url}`);
  next();
});

const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};
app.use(cors(options));

(async () => {
  routerApi(app);
  await setupApolloServer(app);
})();

// redirect
// eslint-disable-next-line no-unused-vars
app.get('/', function (req, res, next) {
  res.redirect('/products');
});

app.get('/recovery', function (req, res) {
  res.redirect('/auth/recovery');
});

// Agregar esta ruta para obtener productos
app.get('/products', async (req, res, next) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/products');
    const products = await response.json();
    res.render('products', { products }); // Pasar los productos a la vista
  } catch (error) {
    next(error); // Manejar errores
  }
});

// 404 middleware
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload },
    } = boom.notFound();

    res.status(statusCode).json(payload);
  }

  res.status(404).render('404');
});

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}`);
});
