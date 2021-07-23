const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const dorayakiRouter = require('./controllers/dorayaki');
const assetsRouter = require('./controllers/assets');
const tokoDorayakiRouter = require('./controllers/toko_dorayaki');
const stokDorayakiRouter = require('./controllers/stok_dorayaki');

const swaggerDoc = YAML.load('./swagger.yaml');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

// main endpoints
app.use('/api/v1/dorayakis', dorayakiRouter());
app.use('/api/v1/toko-dorayakis', tokoDorayakiRouter());
app.use('/api/v1/stok-dorayakis', stokDorayakiRouter());
app.use('/api/v1/assets', assetsRouter);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
