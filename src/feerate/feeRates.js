const responseModel = require("../../shared/helper/responseModel");
const query = require("../../shared/query/queryModel");
const fs = require("fs");
const path = require("path");
const GetFeeRate = async () => {
  try {
    const FeesRates = await query.getFeeRate();
    if (FeesRates.success || FeesRates.data !== -1) {
      const Fees = {
        slow: 0.05,
        med: 0.1,
        fast: 0.5,
      };
      fs.writeFileSync(
        path.resolve(__dirname, "feeRates.json"),
        JSON.stringify(Fees)
      );
      return responseModel.success(Fees);
    }
    const Rates = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "feeRates.json"))
    );
    if (Object.keys(Rates).length) return responseModel.success(Rates);
    return responseModel.error("Not Found");
  } catch (error) {
    console.log(error);
    return responseModel.error("Not Found");
  }
};

module.exports = GetFeeRate;
