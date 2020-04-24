(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Chivatu = factory());
}(this, (function () { 'use strict';

  /**
   * Class Chivatu
   * Checks if elements enter the viewport. Uses singleton pattern.
   *
   * Public method
   *  - add
   *  - isSupported
   *
   * Use example:
   * new Chivatu().add({
        selector: '[data-whatever], .this-is-a-class',
        once: true | false,
        onVisible: (item, ratio) => {show(item)},
        onHidden: (item, ratio) => {hide(item)}
      });
   */
  class Chivatu {
    // Singleton pattern
    constructor(options = {}) {
      if (!!Chivatu.instance) {
        return Chivatu.instance;
      }

      Chivatu.instance = this;

      this.config = [];
      this.observer;

      this.options = Object.assign({
        threshold: [0, 1.0]
      }, options);

      // If browser supports IntersectionObserver, creates the instance.
      if (this.isSupported()) {
        // Create the observer, an instance of IntersectionObserver
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this._loadElement(entry.target, entry.intersectionRatio);
            } else {
              this._unloadElement(entry.target);
            }
          });
        }, this.options);
      }

      return this;
    }

    /**
     * Checks if intersectionObserver is supported
     */
    isSupported() {
      return 'IntersectionObserver' in window;
    }

    /**
     * Adds elements to observer
     * It receives an objetct like this
     * {
     *    selector: String. For selecting elements with QuerySelector. Default ''
     *    once: Boolean. If only needs to intersect once. Default false
     *    onVisible: Function. Executed when element enters the viewport. Receives DOM Element and IntersectionRatio
     *    onHidden: Function. Executed when element leaves completely the viewport
     * }
     * @param {Object} item
     */
    add(item) {
      const { selector } = item;

      this.config.push(item);
      document.querySelectorAll(selector).forEach((i) => this.observer.observe(i));
    }

    /**
     * Executed when element is intersecting in the viewport
     * @param {Node DOM} item DOM Element that is intersecting with the viewport
     * @param {Number [0, 1]} ratio Ratio of the element that is visible on the viewport
     */
    _loadElement(item, ratio) {
      for (let c of this.config) {
        let { selector, once, onVisible } = c;

        if (item.matches(selector)) {
          if (typeof onVisible == 'function') {
            onVisible(item, ratio);
          }
          if (once) {
            this.observer.unobserve(item);
          }
        }
      }
    }

    /**
     * Executed on start if element is not visible and executed when element stops being on viewport
     * @param {Node DOM} item DOM Element that is not intersecting with the viewport
     */
    _unloadElement(item) {
      for (let c of this.config) {
        let { selector, onHidden } = c;

        if (item.matches(selector) && typeof onHidden == 'function') {
          onHidden(item);
        }
      }
    }
  }

  return Chivatu;

})));
