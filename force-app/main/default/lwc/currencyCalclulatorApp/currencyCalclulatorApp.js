import { LightningElement, api } from "lwc";
import getCurrencyData from "@salesforce/apex/getCurrency.getCurrency";
import saveFavourites from "@salesforce/apex/UserCurrencyFavourites.saveFavourites";
import getFavourites from "@salesforce/apex/UserCurrencyFavourites.getFavourites";

export default class CurrencyCalclulatorApp extends LightningElement {
  @api ratesperpage = 10;

  data = [];
  base = "EUR";
  date;
  favourites = [];
  error;

  get isReady() {
    return this.data.length || this.error;
  }

  connectedCallback() {
    this.getRates();
    this.getUsersFavourites();
  }

  getRates() {
    getCurrencyData({ baseCurrency: this.base })
      .then((response) => {
        this.base = response.base;
        this.date = response.date;
        this.data = Object.entries(response.rates);
        if (!this.data.length) {
          this.error = "Fetched currency data is empty";
        }
      })
      .catch((error) => {
        console.error("API error: ", error);
        this.error = "Error: " + error;
      });
  }

  getUsersFavourites() {
    console.log("CurrencyCalclulatorApp::getUsersFavourites:: start");

    getFavourites()
      .then((response) => {
        if (response) {
          this.favourites = response.split(",");
        } else {
          this.favourites = [];
        }
        console.log(
          "CurrencyCalclulatorApp::getUsersFavourites:: this.favourites=",
          this.favourites
        );
      })
      .catch((error) => {
        console.error("APEX error: ", error);
        this.error = "Error: " + error;
      });
  }

  handleBaseCurrencyChange(event) {
    this.base = event.detail;
    this.data = [];
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

    console.log("CurrencyCalclulatorApp::getFavourites:: start!");

    saveFavourites({ favouritesList: this.favourites.join(",") })
      .then((response) => {
        console.log(
          "CurrencyCalclulatorApp::saveFavourites:: response = ",
          response
        );
      })
      .catch((error) => {
        console.error("Apex error: ", error);
        this.error = "Error: " + error;
      });
  }
}
