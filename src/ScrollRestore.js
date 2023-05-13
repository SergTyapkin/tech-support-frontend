// Make Vue plugin: vue.use(<imported ScrollRestore>);
import {nextTick} from "vue";

export default {
  install: (app, workingElement, restorationHrefsAllowed) => {
    app.config.globalProperties.$scroll = new ScrollRestore(app, workingElement, restorationHrefsAllowed);
  }
}

export class ScrollRestore {
  restorationMap = {};
  restorationHrefsAllowed = undefined;
  workingElement = HTMLElement || window;

  constructor(app, workingElement = window, restorationHrefsAllowed=undefined) {
    this.$app = app;
    this.workingElement = workingElement;
    this.restorationHrefsAllowed = restorationHrefsAllowed;
    this.restorationMap = {};
    this._onScrollListener = () => {this._onScroll()};
    this.workingElement.addEventListener("scroll", this._onScrollListener);
  }
  destructor() {
    this.workingElement.removeEventListener("scroll", this._onScrollListener);
  }

  _getHref() {
    return location.pathname;
  }

  _onScroll() {
    const offsetTop = this.workingElement.scrollY || this.workingElement.scrollTop;
    const offsetLeft = this.workingElement.scrollX || this.workingElement.scrollLeft;
    const href = this._getHref();
    if (this.restorationHrefsAllowed === undefined || (Object.keys(this.restorationHrefsAllowed).includes(href))) {
      // console.log(href, this.restorationMap[href])
      this.restorationMap[href] = [offsetTop, offsetLeft];
    }
  }

  async restore() {
    await nextTick();

    const href = this._getHref();
    const savedScroll = this.restorationMap[href];
    // console.log("RESTORE:", href, this.restorationMap)
    if (savedScroll !== undefined) {
      if (this.workingElement === window) {
        this.workingElement.scrollTo(savedScroll[0], savedScroll[1]);
      } else {
        this.workingElement.scrollTop = savedScroll[0];
        this.workingElement.scrollLeft = savedScroll[1];
      }
    }
  }

  clearSavedPageScroll(href=undefined) {
    if (href === undefined)
      href = this._getHref();
    delete this.restorationMap[href];
  }

  clearAllSavedScroll() {
    this.restorationMap = {};
  }
}
