/**
 * Class Chivatu
 * Checks if elements enter the viewport
 *
 * Public method
 *  - add
 *  - isSupported
 *
 * Use example:
 * new Chivatu().add(domNode|domList, {
      once: true | false,
      onVisible: (item, ratio) => {show(item)},
      onHidden: (item) => {hide(item)}
    });
 */
class Chivatu {
  // Singleton pattern
  constructor(options = {}) {
    if (!!Chivatu.instance) {
      return Chivatu.instance;
    }

    Chivatu.instance = this;

    this.subscribers = new WeakMap();
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
   * The available options are:
   * {
   *    once: Boolean. If only needs to intersect once. Default false
   *    onVisible: Function. Executed when element enters the viewport. Receives DOM Element and IntersectionRatio
   *    onHidden: Function. Executed when element leaves completely the viewport
   * }
   * @param {NodeElement|NodeList} domNode Add item to suscribers weakMap. If it is a NodeList, loops through it and call recrusively.
   * @param {Object} options Config options
   */
  add(domNode, options) {
    if (domNode instanceof NodeList) {
      domNode.forEach((node) => this.add(node, options));
      return;
    }
    if (!domNode || this.subscribers.has(domNode)) {
      return
    }

    this.subscribers.set(domNode, options)
    this.observer.observe(domNode)
  }

  /**
   * Executed when element is intersecting in the viewport
   * @param {Node DOM} item DOM Element that is intersecting with the viewport
   * @param {Number [0, 1]} ratio Ratio of the element that is visible on the viewport
   */
  _loadElement(item, ratio) {
    const { once, onVisible } = this.subscribers.get(item);

    if (typeof onVisible == 'function') {
      onVisible.call(null, item, ratio);
    }
    if (once) {
      this.observer.unobserve(item);
    }
  }

  /**
   * Executed on start if element is not visible and executed when element stops being on viewport
   * @param {Node DOM} item DOM Element that is not intersecting with the viewport
   */
  _unloadElement(item) {
    const { onHidden } = this.subscribers.get(item);

    if (typeof onHidden == 'function') {
      onHidden.call(null, item);
    }
  }
}

export default Chivatu;
