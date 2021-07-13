import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
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
  isLoading;

  get isReady() {
    return (this.data.length || this.error) && !this.isLoading;
  }

  connectedCallback() {
    this.getRates();
  }

  getRates() {
    this.isLoading = true;
    getCurrencyData({ baseCurrency: this.base })
      .then((response) => {
        if (!response) {
          this.error = "Fetched currency data is empty";
        }
        let currencyDataModel = JSON.parse(response);
        this.base = currencyDataModel.rates.base;
        this.date = `Last updated: ${
          currencyDataModel.rates.date
        } ${new Date().toLocaleTimeString()}`;
        this.data = Object.entries(currencyDataModel.rates.rates);
        if (!this.data.length) {
          this.showError("Fetched currency data is empty");
        }

        if (currencyDataModel.favourites) {
          this.favourites = currencyDataModel.favourites.split(",");
        } else {
          this.favourites = [];
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.error = `Error: ${error.toString()}`;
        this.showError("Fetched currency data is empty");
        this.isLoading = false;
      });
  }

  handleBaseCurrencyChange(event) {
    this.isLoading = true;
    this.base = event.detail;
    this.data = [];
    setDefaultCurrency({ defaultCurrency: event.detail })
      .then((response) => {
        this.date = `Last updated: ${
          response.date
        } ${new Date().toLocaleTimeString()}`;
        this.data = Object.entries(response.rates);
        if (!this.data.length) {
          this.showError("Fetched currency data is empty");
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.error = `Error: ${error.toString()}`;
        this.showError(error);
        this.isLoading = false;
      });
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
        this.showError(error);
      });
  }

  showError(message) {
    const event = new ShowToastEvent({
      title: "Component error",
      message: message
    });
    this.dispatchEvent(event);
  }
}
