import { LightningElement, api } from "lwc";

export default class Converter extends LightningElement {
  @api basecurrency;
  @api rates;

  targetCurrency;
  baseCurrencyOptions;
  targetCurrencyOptions;
  bcAmount = 1;
  tcAmount;

  get backgroundStyle() {
    return `height:10rem;background-repeat: no-repeat;`;
  }

  get getBaseCurrencyOptions() {
    if (!this.rates || !this.rates.length) {
      return [];
    }

    if (!this.baseCurrencyOptions) {
      this.prepareData();
    }
    return this.baseCurrencyOptions;
  }

  prepareData() {
    if (!this.rates || !this.rates.length) {
      return;
    }
    this.targetCurrencyOptions = this.rates
      .filter(([currency, rate]) => currency !== this.basecurrency)
      .map(([currency, rate], i) => ({
        id: i,
        label: currency,
        value: currency,
        rate: rate
      }));
    if (!this.targetCurrency || this.targetCurrency === this.basecurrency) {
      this.targetCurrency = this.targetCurrencyOptions[0].value;
    }

    this.baseCurrencyOptions = this.rates
      .filter(([currency, rate]) => currency !== this.targetCurrency)
      .map(([currency, rate], i) => ({
        id: i,
        label: currency,
        value: currency
      }));

    this.doConvert();
  }

  connectedCallback() {
    this.prepareData();
  }

  targetCurrencyEntryChange(event) {
    if (event.target.name === "selectTargetCurrency") {
      this.targetCurrency = event.target.value;
      this.doConvert();
    }
  }

  baseCurrencyEntryChange(event) {
    if (event.target.name === "selectBaseCurrency") {
      let newBaseCurrency = event.target.value;

      this.baseCurrencyOptions = undefined;
      const selectedEvent = new CustomEvent("newbasecurrency", {
        detail: newBaseCurrency
      });
      this.dispatchEvent(selectedEvent);
    }

    if (event.target.name === "bcAmount") {
      this.bcAmount = event.target.value;
      this.doConvert();
    }
  }

  doConvert() {
    if (this.bcAmount && this.targetCurrency && this.rates) {
      let rate = this.targetCurrencyOptions.find(
        (row) => row.value === this.targetCurrency
      ).rate;
      this.tcAmount = this.bcAmount * rate;
    }
  }
}
