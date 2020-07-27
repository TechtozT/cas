/* export const BASE_URL = 'localhost';
export const DB_URL = 'mongodb://localhost:27017/cas'; */

const urls = {
  BASE_URL: "localhost",
  DB_URL: "mongodb://localhost:27017/cas",
};

const config = {
  SECRET: "super strong secret",
};

const TCU_DEFAULT_ID = "5f1ef0c40659542cd32fb714";

module.exports = {
  urls,
  config,
  TCU_DEFAULT_ID,
};
