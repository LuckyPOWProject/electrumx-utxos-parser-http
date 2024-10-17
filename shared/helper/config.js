const dotenv = require("dotenv");
dotenv.config();

const ENV_PATH = process.env;

module.exports = {
  port: ENV_PATH.port,
  route: ENV_PATH.route,
  wsHost: ENV_PATH.wsdemon,
};
