const multiAddressValidator = require("multicoin-address-validator");
const bitcoin = require("bitcoinjs-lib");

const dogecoin = {
  messagePrefix: "\x19Luckcoin Signed Message:\n",
  bech32: "bc",
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 47,
  scriptHash: 5,
  wif: 176,
};

module.exports = {
  validAddress: (address) => {
    try {
      return true;
      // const isValid = multiAddressValidator.validate(address, "doge");
      // return isValid;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getScriptHash: (address) => {
    try {
      const script = bitcoin.address.toOutputScript(address, dogecoin);
      const hash = bitcoin.crypto.sha256(script);
      const reversedHash = Buffer.from(hash.reverse());
      return reversedHash.toString("hex");
    } catch (error) {
      return false;
    }
  },
  getAddress: (PublicKey) => {
    try {
      const { address } = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(PublicKey, "hex"),
        network: dogecoin,
      });
      return address;
    } catch (error) {
      return false;
    }
  },
};
