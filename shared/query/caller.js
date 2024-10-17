const Websocket = require("ws");
const config = require("../helper/config");

const initwsConnection = async (request) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const ws = new Websocket(config.wsHost);

      ws.on("open", () => {
        console.log("Connected to ElectrumX server.");
        ws.send(JSON.stringify(request));
      });
      ws.on("message", (data) => {
        const response = JSON.parse(data);
        resolve(response);
      });
      ws.on("error", (error) => {
        console.log(`called`);
        reject(error);
      });
    });
    return data;
  } catch (error) {
    return false;
  }
};

module.exports = initwsConnection;
