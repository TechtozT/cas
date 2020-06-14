/* export const BASE_URL = 'localhost';
export const DB_URL = 'mongodb://localhost:27017/cas'; */

const urls = {
  BASE_URL: "localhost",
  DB_URL: "mongodb://localhost:27017/cas",
};

const config = {
  SECRET: "super strong secret",
};

module.exports = {
  urls,
  config,
};
