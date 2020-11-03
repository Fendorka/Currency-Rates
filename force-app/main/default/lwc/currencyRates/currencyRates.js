import { LightningElement, api } from "lwc";

const columnsChooseCurrency = [
  {
    hideDefaultActions: true,
    type: "button-icon",
    initialWidth: 30,
    typeAttributes: {
      name: "toggleFavourite",
      iconName: { fieldName: "isFavouriteIcon" },
      variant: "bare"
    }
  },
  {
    hideDefaultActions: true,
    type: "button",
    typeAttributes: {
      name: "selectBaseCurrency",
      variant: "base",
      label: { fieldName: "currency" }
    }
  },
  { fieldName: "symbol", hideDefaultActions: true, initialWidth: 20 }
];

export default class CurrencyRates extends LightningElement {
  @api rates;
  @api base;
  @api date;
  @api favourites;

  data;
  favouritesApplied;
  columnsChooseCurrency = columnsChooseCurrency;

  get sortedData() {
    if (!this.rates || !this.rates.length) {
      return [];
    }

    if (!this.data) {
      this.prepareData();
    } else if (!this.favouritesApplied) {
      this.applyFavourites();
    }

    console.log("sortedData()");

    return this.data.filter((row) => !row.isCurrent);
  }

  prepareData() {
    this.data = this.rates.map(([k, v], i) => ({
      id: i,
      symbols: k + " -> " + this.base,
      value: v,
      currency: k,
      symbol: "$",
      isCurrent: k === this.base,
      favourite: false,
      isFavouriteIcon: "utility:pin"
    }));
    this.data.sort((a, b) => +b.favourite - +a.favourite);
  }

  applyFavourites() {
    if (!this.favourites || !this.favourites.length) {
      return;
    }
    console.log("applyFavourites(), fav length=" + this.favourites.length);

    this.data.forEach((row) => {
      let isFav = this.favourites.includes(row.currency);
      row.favourite = isFav;
      row.isFavouriteIcon = isFav ? "utility:pinned" : "utility:pin";
      this.data.sort((a, b) => +b.favourite - +a.favourite);
      // this.data = [...this.data];
    });
    this.favouritesApplied = this.favourites;
  }

  // sortData() {
  // }

  // == Modal ==
  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  handleRowAction(event) {
    var action = event.detail.action;
    var row = event.detail.row;
    switch (action.name) {
      case "toggleFavourite":
        this.toggleCurrencyPin(row.currency);
        break;
      case "selectBaseCurrency":
        this.setBaseCurrency(row.currency);
        break;
      default:
        break;
    }
  }

  toggleCurrencyPin(currencyCode) {
    this.favouritesApplied = undefined;
    const selectedEvent = new CustomEvent("togglefavourite", {
      detail: currencyCode
    });
    this.dispatchEvent(selectedEvent);

    // let row = this.data.find(r => r.currency === currencyCode);
    // if (row) {
    //     let isFav = row.favourite = !row.favourite;
    //     row.isFavouriteIcon = (isFav ? 'utility:pinned' : 'utility:pin');
    //     // this.sortData();
    //     this.data.sort((a, b) => +b.favourite - +a.favourite);
    //     this.data = [...this.data];
    // };
  }

  setBaseCurrency(currencyCode) {
    this.data = undefined;
    const selectedEvent = new CustomEvent("newbasecurrency", {
      detail: currencyCode
    });
    this.dispatchEvent(selectedEvent);
    this.closeModal();
  }
}
