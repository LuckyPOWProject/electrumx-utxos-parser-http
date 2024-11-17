const errortext = require("../../shared/helper/errortext");
const { getScriptHash } = require("../../shared/helper/helper");
const responseModel = require("../../shared/helper/responseModel");
const query = require("../../shared/query/queryModel");

const getUnsepnd = async (address, findCover = false, utxos_filter) => {
  try {
    const LoadUnspendData = await query.getUnspend(address);
    if (!LoadUnspendData.success)
      return responseModel.error(LoadUnspendData.reason);

    const DataToSend = LoadUnspendData.data.map((e) => {
      return {
        txid: e.tx_hash,
        BlockHeight: e.height,
        amount: e.value,
        vout: e.tx_pos,
        script: getScriptHash(address),
      };
    });
    if (utxos_filter) {
      const FilteredData = DataToSend.filter((a) =>
        findCover === true
          ? a.amount === 0.0100036 * 1e8
          : a.amount > 0.0100036 * 1e8
      );
      return FilteredData.length === 0
        ? responseModel.error("utxos Not found")
        : responseModel.success(FilteredData);
    }
    return DataToSend.length === 0
      ? responseModel.error("utxos Not found")
      : responseModel.success(DataToSend);
  } catch (error) {
    return responseModel.error(errortext.serverUnknown);
  }
};

module.exports = getUnsepnd;
