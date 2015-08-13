"use strict";

(function () {
  const DEBUG = true;

  if (DEBUG) {
    // Twitter likes to remove this
    delete window.console;
  }

  let rootNode = document.querySelector(".stream > .stream-items");
  let selector = ".js-actionable-tweet";

  let NodeIterator = require("./NodeIterator");
  let rot13 = require("./rot13");

  class Tweet {
    constructor(element) {
      this.element = element;
      this.element.dataset.zipAugment = "true";
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

}).call(this);
