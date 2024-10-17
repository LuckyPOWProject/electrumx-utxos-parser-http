const errortext = require("../../shared/helper/errortext");
const { getScriptHash, getAddress } = require("../../shared/helper/helper");
const responseModel = require("../../shared/helper/responseModel");
const { getTransaction } = require("../../shared/query/queryModel");
const query = require("../../shared/query/queryModel");

const getHistory = async (address, limit = 10, offset = 0) => {
  try {
    const LoadUnspendData = await query.getHistory(address);
    if (!LoadUnspendData.success)
      return responseModel.error(LoadUnspendData.reason);
    const Formated = LoadUnspendData.data.reverse().slice(offset, limit);
    if (Formated.length === 0)
      return responseModel.error(LoadUnspendData.reason);
    const DataToSend = await Promise.all(
      Formated.map(async (e) => {
        const txid = e.tx_hash;
        const height = e.height;
        const TransactionInfo = await getTransaction(txid);
        if (!TransactionInfo.success) return;
        const Vout = TransactionInfo.data.vout;
        const Vin = TransactionInfo.data.vin;
        const time = TransactionInfo.data.time;
        const confirmations = TransactionInfo.data.confirmations;
        const AddressIndex = Vout.find((a) =>
          a.scriptPubKey?.addresses?.find((b) => b !== address)
        );
        const GetVinAddress = Vin.map((el) => {
          const asmScript = el.scriptSig.asm;
          const PublicKeySplit = asmScript.split(" ");
          const PublicKey = PublicKeySplit[PublicKeySplit.length - 1];
          const Address = getAddress(PublicKey);
          if (Address) return Address;
        });
        const InputAddress = GetVinAddress.filter((a) => a !== undefined);
        const Receiver = AddressIndex?.scriptPubKey?.addresses[0];

        if (
          InputAddress.length > 0 &&
          InputAddress[0].toLowerCase() === address.toLowerCase()
        ) {
          const ValueIndex = Vout.find(
            (a) => a.scriptPubKey.addresses[0] !== address
          );
          if (!ValueIndex) return;
          return {
            type: "Send",
            amount: ValueIndex.value,
            txId: txid,
            receiver: Receiver,
            sender: address,
            time,
            confirmations,
            height,
          };
        }
        const ValueIndex = Vout.find((a) =>
          a.scriptPubKey?.addresses?.find((b) => b === address)
        );

        return {
          type: "Received",
          amount: ValueIndex.value,
          txId: txid,
          sender: InputAddress[0],
          receiver: address,
          time,
          confirmations,
          height,
        };
      })
    );
    return responseModel.success(
      DataToSend.filter((a) => a !== undefined).sort((A, B) => B.Time - A.Time)
    );
  } catch (error) {
    console.log(error);
    return responseModel.error(errortext.serverUnknown);
  }
};

module.exports = getHistory;
