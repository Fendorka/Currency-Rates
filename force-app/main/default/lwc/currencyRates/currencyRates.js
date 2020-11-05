import { LightningElement, api } from "lwc";
import currencySymbols from "./map";

export default class CurrencyRates extends LightningElement {
  @api rates;
  @api base;
  @api date;
  @api favourites;
  @api ratesperpage;

  isLoaded = false;
  data;
  favouritesApplied;

  get sortedData() {
    if (!this.rates || !this.rates.length) {
      return [];
    }

    if (!this.data) {
      this.prepareData();
    } else if (!this.favouritesApplied) {
      this.applyFavourites();
    }
    return this.data.filter((row) => !row.isCurrent);
  }

  connectedCallback() {
    this.prepareData();
  }

  prepareData() {
    this.data = this.rates.map(([cur, rate], i) => ({
      id: i,
      symbols: this.base + " -> " + cur,
      value: rate,
      currency: cur,
      symbol: currencySymbols[cur],
      isCurrent: cur === this.base,
      favourite: false,
      isFavouriteIcon: "utility:pin",
      isFavouriteIcon2: ""
    }));
    this.data.sort((a, b) => +b.favourite - +a.favourite);

    if (!this.favouritesApplied) {
      this.applyFavourites();
    }

    this.isLoaded = true;
  }

  applyFavourites() {
    if (!this.favourites) {
      return;
    }
    this.data.forEach((row) => {
      let isFav = this.favourites.includes(row.currency);
      row.favourite = isFav;
      row.isFavouriteIcon = isFav ? "utility:pinned" : "utility:pin";
      row.isFavouriteIcon2 = isFav ? "utility:pinned" : "";
      this.data.sort((a, b) => +b.favourite - +a.favourite);
    });
    this.favouritesApplied = true;
  }

  refreshRates() {
    this.data = undefined;
    const selectedEvent = new CustomEvent("newbasecurrency", {
      detail: this.base
    });
    this.dispatchEvent(selectedEvent);
  }

  // Change currency Modal
  isShownChooseCurrencyModal = false;
  changeBaseCurrency() {
    this.isShownChooseCurrencyModal = true;
  }

  showChooseCurrencyModal(event) {
    let isVisibile = event.detail;
    this.isShownChooseCurrencyModal = isVisibile;
  }

  handleBaseCurrencyChange(event) {
    this.data = undefined;
    this.favouritesApplied = false;
    const selectedEvent = new CustomEvent("newbasecurrency", {
      detail: event.detail
    });
    this.dispatchEvent(selectedEvent);
  }

  handleFavouriteCurrencyChange(event) {
    this.favouritesApplied = false;
    const selectedEvent = new CustomEvent("togglefavourite", {
      detail: event.detail
    });
    this.dispatchEvent(selectedEvent);
  }
}
