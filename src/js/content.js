"use strict";

(function () {
  var selector = ".js-actionable-tweet";

  function arr(arrLike) {
    return Array.prototype.slice.call(arrLike);
  }

  function rot13text(text) {
    return text.replace(/[a-z]/g, function (c) {
      var a = "a".charCodeAt(0);
      return String.fromCharCode((c.charCodeAt(0) - a + 13) % 26 + a);
    }).replace(/[A-Z]/g, function (c) {
      var a = "A".charCodeAt(0);
      return String.fromCharCode((c.charCodeAt(0) - a + 13) % 26 + a);
    });
  }

  function rot13node(node) {
    var clone = node.cloneNode(true);
    for (let element of arr(clone.childNodes)) {
      if (element.nodeType == Node.TEXT_NODE) {
        clone.replaceChild(new Text(rot13text(element.textContent)), element);
        clone.classList.add("rot13");
      }
    };
    return clone;
  }

  function rot13tweets(tweets) {
    for (let tweet of arr(tweets)) { rot13tweet(tweet); }
  }

  function rot13tweet(tweet) {
    var text = tweet.querySelector(".tweet-text");
    if (text == null) return;
    var augment = rot13node(text);
    text.parentNode.insertBefore(augment, text.nextSibling);
  }

  // Get everything not already on display
  var mutationObserver = new MutationObserver((mutationRecords, mutationObserver) => {
    for (let mutationRecord of mutationRecords) {
      for (let node of arr(mutationRecord.addedNodes)) {
        rot13tweets(node.querySelectorAll(selector));
      }
    }
  });

  // Observe the (first) twitter stream on the page
  mutationObserver.observe(document.querySelector(".stream > .stream-items"), {
    childList: true
  });

  // Get everything already on display
  rot13tweets(document.querySelectorAll(selector));
}).call(this);
