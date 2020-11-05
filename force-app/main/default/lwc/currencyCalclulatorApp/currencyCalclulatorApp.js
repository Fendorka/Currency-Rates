import { LightningElement, api } from "lwc";
import getCurrencyData from "@salesforce/apex/CurrencyCalculator_Ctrl.getCurrencyData";
import setDefaultCurrency from "@salesforce/apex/CurrencyCalculator_Ctrl.setDefaultCurrency";
import saveFavourites from "@salesforce/apex/UserCurrencyFavourites.saveFavourites";

export default class CurrencyCalclulatorApp extends LightningElement {
  @api ratesperpage = 10;

  data = [];
  base;
  date;
  favourites = [];
  error;

  get isReady() {
    return this.data.length || this.error;
  }

  connectedCallback() {
    this.getRates();
  }

  getRates() {
    getCurrencyData({ baseCurrency: this.base })
      .then((response) => {
        if (!response) {
          this.error = "Fetched currency data is empty";
        }

        let currencyDataModel = JSON.parse(response);

        this.base = currencyDataModel.rates.base;
        this.date =
          "Last updated: " +
          currencyDataModel.rates.date +
          " " +
          new Date().toLocaleTimeString();
        this.data = Object.entries(currencyDataModel.rates.rates);
        if (!this.data.length) {
          this.error = "Fetched currency data is empty";
        }

        if (currencyDataModel.favourites) {
          this.favourites = currencyDataModel.favourites.split(",");
        } else {
          this.favourites = [];
        }
      })
      .catch((error) => {
        console.error("API error: ", error);
        this.error = "Error: " + error.toString();
      });
  }

  handleBaseCurrencyChange(event) {
    this.base = event.detail;
    this.data = [];

    console.log("handleBaseCurrencyChange", this.base);

    setDefaultCurrency({ defaultCurrency: this.base })
      .then((response) => {
        // this.base = response.base;
        this.date =
          "Last updated: " +
          response.date +
          " " +
          new Date().toLocaleTimeString();
        this.data = Object.entries(response.rates);
        if (!this.data.length) {
          //TODO show toast and reload button
          this.error = "Fetched currency data is empty";
        }
      })
      .catch((error) => {
        console.error("Apex error: ", error);
        this.error = "Error: " + error;
      });

    this.getRates();
  }

  handleFavouriteCurrencyChange(event) {
    let toggledFav = event.detail;
    let index = this.favourites.indexOf(toggledFav);
    if (index !== -1) {
      this.favourites.splice(index, 1);
    } else {
      this.favourites.push(toggledFav);
    }
    this.favourites = [...this.favourites];

    saveFavourites({ favouritesList: this.favourites.join(",") })
      .then((response) => {})
      .catch((error) => {
        console.error("Apex error: ", error);
        this.error = "Error: " + error;
      });
  }
}
