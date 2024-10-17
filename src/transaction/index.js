const errortext = require("../../shared/helper/errortext");
const responseModel = require("../../shared/helper/responseModel");
const query = require("../../shared/query/queryModel");

const BoadcastRawTransaction = async (raw) => {
  try {
    const SignTransaction = await query.signTransaction(raw);
    if (SignTransaction.success === false) {
      return responseModel.error(SignTransaction.reason.split("\n")[2]);
    }
    return responseModel.success(SignTransaction.data);
  } catch (error) {
    return responseModel.error(errortext.serverUnknown);
  }
};

module.exports = BoadcastRawTransaction;
