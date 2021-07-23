const logger = require('./logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res) => {
  logger.info(err.name);
  if (err.name === 'TokenExpiredError') {
    return res.status(401).send({ error: 'JWT Token has expired' });
  }
  return res.status(400).send({ error: err.message });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
