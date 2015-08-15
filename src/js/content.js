(function () {
  const DEBUG = true;

  if (DEBUG) {
    // Twitter likes to remove this
    delete window.console;
    console.log("Loading");
  }

  let rootNode = "AppContent";

  let plugins = {
    _plugins: new Set(),
    register(plugin) {
      this._plugins.add(plugin);
    },
    attach(tweet) {
      for (let plugin of this._plugins) {
        plugin.attach(tweet);
      }
    }
  }

  let NodeIterator = require("./NodeIterator");
  let rot13 = require("./rot13");
  plugins.register(rot13);

  let mappings = {};
  let componentRegistry = new WeakMap();

  let Observers = require("./Observers");

  function augmentClass(node) {
    if (!node) return;
    if (node.nodeType != Node.ELEMENT_NODE) return;
    for (let name of Object.keys(mappings)) {
      if (node.classList.contains(name)) {
        return mappings[name].of(node);
      }
    }
  }

  let observer = Observers.addRemoveObserver(augmentClass, (node) => {
    let component = componentRegistry.get(node);
    for (let name of Object.keys(mappings)) {
      if (node.nodeType != Node.ELEMENT_NODE) return;
      for (let subnode of node.querySelectorAll(`.${name}`).iterator) {
        if (componentRegistry.has(subnode)) {
          componentRegistry.get(subnode).cleanup();
        }
      }
    }
    if (component && component.cleanup) {
      component.cleanup();
    }
  }, augmentClass);
  observer.observe(document.body, {subtree: true});

  class Component {
    constructor(element) {
      componentRegistry.set(element, this);
      this.element = element;
      element.dataset.zipAugment = this.constructor.name;
      /* Hunt down any nodes to register */
      for (let name of Object.keys(mappings)) {
        for (let node of element.querySelectorAll(`.${name}`).iterator) {
          mappings[name].of(node);
        }
      }
    }

    cleanup() {
      delete this.element.dataset.zipAugment;
      componentRegistry.delete(this.element);
    }
  }

  class Tweet extends Component {
    constructor(element) {
      super(element);
      this.buttons = [];
      plugins.attach(this);
    }

    cleanup() {
      for (let {name, fn} of this.buttons) {
        let node = this.element.querySelector(".dropdown-menu > ul > " + `[data-nav="zip-${name}"]`);
        if (node) node.remove();
      }
    }

    addButton(name, onClick) {
      let existing = this.element.querySelector(".js-more-profileTweet-actions .dropdown-menu > ul > " + `[data-nav="zip-${name}"]`)
      if (existing) {
        console.log(`${name} already attached`, existing);
        existing.removeEventListener("click", onClick);
        existing.addEventListener("click", onClick);
        return;
      }

      this.buttons.push({name, onClick});
      let li = document.createElement("li");
      let button = document.createElement("button");
      li.setAttribute("role", "presentation");
      li.setAttribute("data-nav", "zip-" + name);
      button.setAttribute("role", "menuitem");
      button.setAttribute("class", "dropdown-link zip-" + name);
      li.appendChild(button);
      button.appendChild(new Text(name));
      this.element.querySelector(".dropdown-menu > ul").appendChild(li);
      button.addEventListener("click", onClick);
    }

    static of(element) {
      return componentRegistry.get(element) || new Tweet(element);
    }
  }

  class Stream extends Component {
    static of(element) {
      return componentRegistry.get(element) || new Stream(element);
    }
  }

  class StreamItem extends Component {
    static of(element) {
      return componentRegistry.get(element) || new StreamItem(element);
    }
  }

  mappings = {
    "AppContent": Stream,
    "js-stream-item": StreamItem,
    "js-actionable-tweet": Tweet
  };

  Stream.of(document.querySelector(`.${rootNode}`));
}).call(this);
