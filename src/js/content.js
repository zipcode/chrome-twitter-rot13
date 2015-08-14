(function () {
  const DEBUG = true;

  if (DEBUG) {
    // Twitter likes to remove this
    delete window.console;
    console.log("Loading");
  }

  let rootNode = document.querySelector(".stream > .stream-items");
  let selector = ".js-actionable-tweet";

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

  let Observers = require("./Observers");

  let destructorObserver = Observers.addRemoveObserver(undefined, (node) => {
    let component = componentRegistry.get(node);
    if (component && component.cleanup) {
      component.cleanup();
    }
  });
  destructorObserver.observe(document.body, {subtree: true});

  let componentRegistry = new WeakMap();

  class Component {
    constructor(element) {
      this.__element = new WeakSet();
      componentRegistry.set(element, this);
      this.element = element;
    }

    get element() {
      for (let element of this.__element) {
        return element;
      }
    }

    set element(value) {
      this.__element.add(value);
      return value;
    }

    cleanup() {
      console.log("Someone deleted me!", this);
    }
  }

  class Tweet extends Component {
    constructor(element) {
      super(element);
      this.element.dataset.zipAugment = "true";
      this.buttons = [];
      plugins.attach(this);
    }

    addButton(name, onClick) {
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

  let s = new Stream(document.querySelector(".stream"));

}).call(this);
