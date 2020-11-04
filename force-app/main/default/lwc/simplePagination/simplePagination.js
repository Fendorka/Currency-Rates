import { LightningElement, track, api } from "lwc";

const columns = [
  {
    label: "Symbols",
    fieldName: "symbols",
    hideDefaultActions: true,
    cellAttributes: {
      iconName: { fieldName: "isFavouriteIcon2" }
    }
  },
  {
    label: "Value",
    fieldName: "value",
    hideDefaultActions: true,
    cellAttributes: {
      class: { fieldName: "cellClass" }
    }
  }
];

export default class SimplePagination extends LightningElement {
  @api tabledata = [];
  @api perpage = 5;

  @track page = 1;
  @track pages = [];
  set_size = 5;

  columns = columns;

  renderedCallback() {
    this.renderButtons();
  }
  renderButtons = () => {
    this.template.querySelectorAll("button").forEach((but) => {
      but.className =
        "slds-button " +
        (this.page === parseInt(but.dataset.id, 10)
          ? "slds-button_brand"
          : "slds-button_neutral");
    });
  };
  get pagesList() {
    let mid = Math.floor(this.set_size / 2) + 1;
    if (this.page > mid) {
      return this.pages.slice(this.page - mid, this.page + mid - 1);
    }
    return this.pages.slice(0, this.set_size);
  }

  connectedCallback() {
    this.setPages(this.tabledata);
  }

  pageData = () => {
    let page = this.page;
    let perpage = this.perpage;
    let startIndex = page * perpage - perpage;
    let endIndex = page * perpage;
    return this.tabledata.slice(startIndex, endIndex);
  };

  setPages = (data) => {
    let numberOfPages = Math.ceil(data.length / this.perpage);
    for (let index = 1; index <= numberOfPages; index++) {
      this.pages.push(index);
    }
  };

  get hasPrev() {
    return this.page > 1;
  }

  get hasNext() {
    return this.page < this.pages.length;
  }

  onNext = () => {
    ++this.page;
  };

  onPrev = () => {
    --this.page;
  };

  onPageClick = (e) => {
    this.page = parseInt(e.target.dataset.id, 10);
  };

  get currentPageData() {
    return this.pageData();
  }
}
