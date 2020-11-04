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

export default class ChooseCurrencyModal extends LightningElement {
  @api currencydata;
  columnsChooseCurrency = columnsChooseCurrency;

  openModal() {
    const selectedEvent = new CustomEvent("setmodalvisibility", {
      detail: true
    });
    this.dispatchEvent(selectedEvent);
  }
  closeModal() {
    const selectedEvent = new CustomEvent("setmodalvisibility", {
      detail: false
    });
    this.dispatchEvent(selectedEvent);
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
    const selectedEvent = new CustomEvent("togglefavourite", {
      detail: currencyCode
    });
    this.dispatchEvent(selectedEvent);
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
