const config = require("./shared/helper/config");

const express = require("express");
const helper = require("./shared/helper/helper");
const responseModel = require("./shared/helper/responseModel");
const errortext = require("./shared/helper/errortext");
const getUnsepnd = require("./src/unspend");
const LoadWalletBalance = require("./src/balance");
const getHistory = require("./src/history");
const app = express();
const cors = require("cors");
const Bodyparser = require("body-parser");
const BoadcastRawTransaction = require("./src/transaction");
const GetDogePrices = require("./src/price");
const GetFeeRate = require("./src/feerate/feeRates");

const RoutePath = config.route;

app.use(cors({ origin: "*" }));
app.use(Bodyparser.json());

app.get(`${RoutePath}/:address/unspent`, async (req, res) => {
  try {
    const wallet = req.params.address;

    const utxos_filter = req.query.utxos_filter ? false : true;

    if (!wallet || !helper.validAddress(wallet)) {
      res.json(responseModel.error(errortext.invalidAddress));
      return;
    }
    const data = await getUnsepnd(wallet, false, utxos_filter);
    res.json(data);
  } catch (error) {}
});

app.get(`${RoutePath}/:address/coverunspent`, async (req, res) => {
  try {
    const wallet = req.params.address;
    if (!wallet || !helper.validAddress(wallet)) {
      res.json(responseModel.error(errortext.invalidAddress));
      return;
    }
    const data = await getUnsepnd(wallet, true, true);
    res.json(data);
  } catch (error) {}
});

app.get(`${RoutePath}/:address/balance`, async (req, res) => {
  const wallet = req.params.address;
  if (!wallet || !helper.validAddress(wallet)) {
    res.json(responseModel.error(errortext.invalidAddress));
    return;
  }
  const data = await LoadWalletBalance(wallet);
  res.json(data);
});

app.get(`${RoutePath}/:address/history`, async (req, res) => {
  const wallet = req.params.address;
  const limit = req.query.limit || 10;
  if (!wallet || !helper.validAddress(wallet)) {
    res.json(responseModel.error(errortext.invalidAddress));
    return;
  }
  const data = await getHistory(wallet, limit);
  res.json(data);
});

app.post(`${RoutePath}/signraw`, async (req, res) => {
  const rawTransaction = req.body.raw;
  if (rawTransaction && rawTransaction.length > 20) {
    const Data = await BoadcastRawTransaction(rawTransaction);
    res.json(Data);
    return;
  }
  res.json(responseModel.error("Invalid Raw Transaction."));
});

app.get(`${RoutePath}/price`, async (req, res) => {
  try {
    const Data = await GetDogePrices();
    res.json(Data);
  } catch (error) {}
});

app.get(`${RoutePath}/feerates`, async (req, res) => {
  try {
    const Data = await GetFeeRate();
    res.json(Data);
  } catch (error) {}
});

app.listen(config.port, () => {
  console.log(
    `Server is Running at Port:- ${config.port}\n\nurl: http://localhost:${config.port}`
  );
});
