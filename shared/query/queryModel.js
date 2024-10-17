const errortext = require("../helper/errortext");
const helper = require("../helper/helper");
const initwsConnection = require("./caller");

const query = {
  getUnspend: async (address) => {
    try {
      const scriptHash = helper.getScriptHash(address);
      if (!scriptHash) {
        return { success: false, reason: errortext.invalidAddress };
      }
      const requestModel = {
        id: 1,
        method: "blockchain.scripthash.listunspent",
        params: [scriptHash],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: errortext.serverUnknown };
    } catch (error) {
      console.log(error);
      return { success: false, reason: errortext.serverUnknown };
    }
  },
  getBalance: async (address) => {
    try {
      const scriptHash = helper.getScriptHash(address);
      if (!scriptHash) {
        return { success: false, reason: errortext.invalidAddress };
      }
      const requestModel = {
        id: 1,
        method: "blockchain.scripthash.get_balance",
        params: [scriptHash],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: errortext.serverUnknown };
    } catch (error) {
      console.log(error);
      return { success: false, reason: errortext.serverUnknown };
    }
  },
  getHistory: async (address) => {
    try {
      const scriptHash = helper.getScriptHash(address);
      if (!scriptHash) {
        return { success: false, reason: errortext.invalidAddress };
      }
      const requestModel = {
        id: 1,
        method: "blockchain.scripthash.get_history",
        params: [scriptHash],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: errortext.serverUnknown };
    } catch (error) {
      console.log(error);
      return { success: false, reason: errortext.serverUnknown };
    }
  },
  getTransaction: async (txid, full = true) => {
    try {
      const requestModel = {
        id: 1,
        method: "blockchain.transaction.get",
        params: [txid, full],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: errortext.serverUnknown };
    } catch (error) {
      return { success: false, reason: errortext.serverUnknown };
    }
  },
  signTransaction: async (rawtxid) => {
    try {
      const requestModel = {
        id: 1,
        method: "blockchain.transaction.broadcast",
        params: [rawtxid],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: fire.error.message };
    } catch (error) {
      return { success: false, reason: errortext.serverUnknown };
    }
  },
  getFeeRate: async () => {
    try {
      const requestModel = {
        id: 1,
        method: "blockchain.estimatefee",
        params: [100],
      };
      const fire = await initwsConnection(requestModel);
      if (fire.result) {
        return { success: true, data: fire.result };
      }
      return { success: false, reason: fire.error.message };
    } catch (error) {
      return { success: false, reason: errortext.serverUnknown };
    }
  },
};

module.exports = query;
