const mongoose = require('mongoose');
const seedToko = require('./seed_toko');
const seedDorayaki = require('./seed_dorayaki');
const logger = require('../utils/logger');

const seedDB = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();

    for (let i = 0; i < collections.length; i++) {
      await mongoose.connection.db.dropCollection(collections[i].name);
    }

    await seedToko();
    await seedDorayaki();
  } catch (err) {
    logger.error(err);
  }
};

module.exports = seedDB;
