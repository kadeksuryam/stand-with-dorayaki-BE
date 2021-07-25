const logger = require('./logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.info(err.message);
  res.status(400).send({ error: err.message });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
