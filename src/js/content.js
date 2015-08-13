module.exports = (function () {
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

  class Tweet {
    constructor(element) {
      this.element = element;
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
      return new Tweet(element);
    }
  }

  // Get everything not already on display
  var mutationObserver = new MutationObserver((mutationRecords, mutationObserver) => {
    for (let mutationRecord of mutationRecords) {
      for (let node of mutationRecord.addedNodes.iterator) {
        for (let tweet of node.querySelectorAll(selector).iterator) {
          Tweet.of(tweet);
        }
      }
    }
  });

  // Observe the (first) twitter stream on the page
  mutationObserver.observe(rootNode, {
    childList: true
  });

  for (let tweet of rootNode.querySelectorAll(selector).iterator) {
    Tweet.of(tweet);
  }

  return {
    Tweet,
    NodeIterator,
    rot13
  }
}).call(this);
