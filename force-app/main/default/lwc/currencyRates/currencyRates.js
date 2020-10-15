import { LightningElement } from "lwc";
import getCurrencyData from "@salesforce/apex/getCurrency.getCurrency";

const columns = [
  { label: "Currency", fieldName: "currency", hideDefaultActions: true },
  { label: "Value", fieldName: "value", hideDefaultActions: true }
];

export default class CurrencyRates extends LightningElement {
  data = [];
  columns = columns;
  base;
  date;
  error;

  connectedCallback() {
    this.getRates();
  }

  getRates() {
    const url = "https://api.ratesapi.io/api/latest";
    getCurrencyData({ URL: url })
      .then((response) => {
        this.data = [];
        this.base = response.base;
        this.date = response.date;
        let rate = response.rates;

        for (let i = 0; i < Object.keys(rate).length; i++) {
          this.data.push({
            id: i,
            currency: Object.keys(rate)[i],
            value: Object.values(rate)[i]
          });
        }
      })
      .catch((error) => {
        this.error = "Error: " + error;
      });
  }
}
