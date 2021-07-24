require('dotenv').config();

const PORT = 5000;
let MONGODB_URI = 'mongodb://mongodb:27017';

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = 'mongodb://localhost:27017';
}

module.exports = {
  PORT,
  MONGODB_URI,
};
