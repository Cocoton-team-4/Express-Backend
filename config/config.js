const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

const config = {
  "development": {
    "user": env.DEVELOPMENT_NAME,
    "password": env.DEVELOPMENT_PASSWORD,
    "database": env.DEVELOPMENT_DATABASE,
    "host": env.DEVELOPMENT_ADDRESS,
    "dialect": "mysql",
    "logging": false,
  }
}

module.exports = config;