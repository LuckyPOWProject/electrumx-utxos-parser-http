const errortext = require("../../shared/helper/errortext");
const responseModel = require("../../shared/helper/responseModel");
const query = require("../../shared/query/queryModel");

const LoadWalletBalance = async (address) => {
  try {
    const LoadedBalanceData = await query.getBalance(address);
    if (!LoadedBalanceData.success)
      return responseModel.error(LoadedBalanceData.reason);

    return responseModel.success(LoadedBalanceData.data);
  } catch (error) {
    console.log(error);
    return responseModel.error(errortext.serverUnknown);
  }
};
module.exports = LoadWalletBalance;
