import { LightningElement, api } from "lwc";
// import currencySymbols from "./map";

export default class CurrencyRates extends LightningElement {
  @api rates;
  @api base;
  @api date;
  @api favourites;
  @api ratesperpage;

  isLoaded = false;
  data;
  favouritesApplied;
  lastUpdateTimestamp;

  get sortedData() {
    if (!this.rates || !this.rates.length) {
      return [];
    }

    if (!this.data || this.lastUpdateTimestamp !== this.date) {
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
      symbol: this.currencySymbols[cur],
      isCurrent: cur === this.base,
      favourite: false,
      isFavouriteIcon: "utility:pin",
      isFavouriteIcon2: ""
    }));
    this.data.sort((a, b) => +b.favourite - +a.favourite);

    if (!this.favouritesApplied || this.lastUpdateTimestamp !== this.date) {
      this.applyFavourites();
    }
    this.lastUpdateTimestamp = this.date;
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

  currencySymbols = {
    AED: "د.إ",
    AFN: "؋",
    ALL: "L",
    AMD: "֏",
    ANG: "ƒ",
    AOA: "Kz",
    ARS: "$",
    AUD: "$",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "KM",
    BBD: "$",
    BDT: "৳",
    BGN: "лв",
    BHD: ".د.ب",
    BIF: "FBu",
    BMD: "$",
    BND: "$",
    BOB: "$b",
    BRL: "R$",
    BSD: "$",
    BTC: "฿",
    BTN: "Nu.",
    BWP: "P",
    BYR: "Br",
    BYN: "Br",
    BZD: "BZ$",
    CAD: "$",
    CDF: "FC",
    CHF: "CHF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CRC: "₡",
    CUC: "$",
    CUP: "₱",
    CVE: "$",
    CZK: "Kč",
    DJF: "Fdj",
    DKK: "kr",
    DOP: "RD$",
    DZD: "دج",
    EEK: "kr",
    EGP: "£",
    ERN: "Nfk",
    ETB: "Br",
    ETH: "Ξ",
    EUR: "€",
    FJD: "$",
    FKP: "£",
    GBP: "£",
    GEL: "₾",
    GGP: "£",
    GHC: "₵",
    GHS: "GH₵",
    GIP: "£",
    GMD: "D",
    GNF: "FG",
    GTQ: "Q",
    GYD: "$",
    HKD: "$",
    HNL: "L",
    HRK: "kn",
    HTG: "G",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    IMP: "£",
    INR: "₹",
    IQD: "ع.د",
    IRR: "﷼",
    ISK: "kr",
    JEP: "£",
    JMD: "J$",
    JOD: "JD",
    JPY: "¥",
    KES: "KSh",
    KGS: "лв",
    KHR: "៛",
    KMF: "CF",
    KPW: "₩",
    KRW: "₩",
    KWD: "KD",
    KYD: "$",
    KZT: "лв",
    LAK: "₭",
    LBP: "£",
    LKR: "₨",
    LRD: "$",
    LSL: "M",
    LTC: "Ł",
    LTL: "Lt",
    LVL: "Ls",
    LYD: "LD",
    MAD: "MAD",
    MDL: "lei",
    MGA: "Ar",
    MKD: "ден",
    MMK: "K",
    MNT: "₮",
    MOP: "MOP$",
    MRO: "UM",
    MRU: "UM",
    MUR: "₨",
    MVR: "Rf",
    MWK: "MK",
    MXN: "$",
    MYR: "RM",
    MZN: "MT",
    NAD: "$",
    NGN: "₦",
    NIO: "C$",
    NOK: "kr",
    NPR: "₨",
    NZD: "$",
    OMR: "﷼",
    PAB: "B/.",
    PEN: "S/.",
    PGK: "K",
    PHP: "₱",
    PKR: "₨",
    PLN: "zł",
    PYG: "Gs",
    QAR: "﷼",
    RMB: "￥",
    RON: "lei",
    RSD: "Дин.",
    RUB: "₽",
    RWF: "R₣",
    SAR: "﷼",
    SBD: "$",
    SCR: "₨",
    SDG: "ج.س.",
    SEK: "kr",
    SGD: "$",
    SHP: "£",
    SLL: "Le",
    SOS: "S",
    SRD: "$",
    SSP: "£",
    STD: "Db",
    STN: "Db",
    SVC: "$",
    SYP: "£",
    SZL: "E",
    THB: "฿",
    TJS: "SM",
    TMT: "T",
    TND: "د.ت",
    TOP: "T$",
    TRL: "₤",
    TRY: "₺",
    TTD: "TT$",
    TVD: "$",
    TWD: "NT$",
    TZS: "TSh",
    UAH: "₴",
    UGX: "USh",
    USD: "$",
    UYU: "$U",
    UZS: "лв",
    VEF: "Bs",
    VND: "₫",
    VUV: "VT",
    WST: "WS$",
    XAF: "FCFA",
    XBT: "Ƀ",
    XCD: "$",
    XOF: "CFA",
    XPF: "₣",
    YER: "﷼",
    ZAR: "R",
    ZWD: "Z$"
  };
}
