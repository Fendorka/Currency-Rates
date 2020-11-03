import { LightningElement, track, api } from "lwc";
// import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
// import { fireToast } from 'c/lwcutils';

// images
// import bitcoinBackgroundUrl from '@salesforce/resourceUrl/bitcoinBackground_small';

// apex methods
// import apexMakeHTTPCall from '@salesforce/apex/ConverterSupportClassLightning.makeHTTPCall';
// import apexDefaultCurrencyEntryChanges
//   from '@salesforce/apex/ConverterSupportClassLightning.defaultCurrencyEntryChanges';
// import apextargetCurrencyEntryChanges
//   from '@salesforce/apex/ConverterSupportClassLightning.targetCurrencyEntryChanges';

// SObject
// import RATE_CODE_OBJECT from '@salesforce/schema/Rate_Code__c';

// picklist fields
// import CURRENCY_FIELD from '@salesforce/schema/Rate_Code__c.Currency__c';

export default class Converter extends LightningElement {
  @api basecurrency;
  @api rates;

  isLoaded;
  targetCurrency;
  baseCurrencyOptions;
  targetCurrencyOptions; // picklist values
  bcAmount = 1;
  tcAmount;

  @track showspinner = false;
  @track errorMessage;

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
    this.targetCurrency = this.targetCurrencyOptions[0].value;

    this.baseCurrencyOptions = this.rates
      .filter(([currency, rate]) => currency !== this.targetCurrency)
      .map(([currency, rate], i) => ({
        id: i,
        label: currency,
        value: currency
      }));

    this.baseCurrencyOptions = [
      {
        id: this.baseCurrencyOptions.length + 1,
        label: this.basecurrency,
        value: this.basecurrency
      },
      ...this.baseCurrencyOptions
    ];

    //   this.data.sort((a, b) => +b.favourite - +a.favourite);

    this.doConvert();
    this.isLoaded = true;
  }

  connectedCallback() {
    this.prepareData();
  }

  targetCurrencyEntryChange(event) {
    // let submitCurrencyChanges = {};

    if (event.target.name === "selectTargetCurrency") {
      this.targetCurrency = event.target.value;
      this.doConvert();
    }
  }

  baseCurrencyEntryChange(event) {
    // let submitCurrencyChanges = {};

    if (event.target.name === "selectBaseCurrency") {
      let newBaseCurrency = event.target.value;

      this.isLoaded = false;
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

  setError(message) {
    this.errorMessage = message;
  }

  clearErrors() {
    this.errorMessage = undefined;
  }
}
