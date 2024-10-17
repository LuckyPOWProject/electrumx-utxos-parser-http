const { default: axios } = require("axios");
const responseModel = require("../../shared/helper/responseModel");
const fs = require("fs");
const path = require("path");
const GetDogePrices = async () => {
  try {
    const DogePrice = await axios.get(
      `https://inscriber.ordifind.com/extra/price`
    );
    if (DogePrice.data && DogePrice.data.code === 200) {
      const Price = DogePrice.data.data.usd;

      const RatedSaved = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "latestRates.json"))
      );

      const NewDataToUpdate = {
        price: Price,
      };

      fs.writeFileSync(
        path.resolve(__dirname, "dogePrice.json"),
        JSON.stringify(NewDataToUpdate)
      );

      return responseModel.success({
        dogePrice: Price,
        FlatRate: RatedSaved["rates"],
      });
    }

    const RatedSaved = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "latestRates.json"))
    );
    const DogePrices = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "dogePrice.json"))
    );

    if (RatedSaved.rates) {
      return responseModel.success({
        dogePrice: DogePrices?.price || 0.095,
        FlatRate: RatedSaved["rates"],
      });
    }
    return responseModel.error("Not Found");
  } catch (error) {
    const RatedSaved = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "latestRates.json"))
    );
    const DogePrices = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "dogePrice.json"))
    );
    if (RatedSaved.rates.length > 0) {
      return responseModel.success({
        dogePrice: DogePrices?.price || 0.095,
        FlatRate: RatedSaved["rates"],
      });
    }
    return responseModel.error(error.message);
  }
};

module.exports = GetDogePrices;
