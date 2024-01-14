const path = require('path');
const boom = require('@hapi/boom');
const express = require('express');
const cors = require('cors');

// require routes
const productsRouter = require('./routes/products.view');
const routerApi = require('./routes');

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

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

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

app.use('/products', productsRouter);
routerApi(app);

// redirect
// eslint-disable-next-line no-unused-vars
app.get('/', function (req, res, next) {
  res.redirect('/products');
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
