"use strict";

(function () {
  var mutationObserver = new MutationObserver(
    function observerCallback(mutationRecords, mutationObserver) {
      mutationRecords.forEach(function (mutationRecord) {
        for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
          var node = mutationRecord.addedNodes[i];
          rot13tweets(node.querySelectorAll(".tweet"));
        }
      });
    }
  );

  // Observe the (first) twitter stream on the page
  mutationObserver.observe(document.querySelector(".stream > .stream-items"), {
    childList: true
  });

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
    for (var i = 0; i < clone.childNodes.length; i++) {
      var element = clone.childNodes[i];
      if (element.nodeType == Node.TEXT_NODE) {
        clone.replaceChild(new Text(rot13text(element.textContent)), element);
        clone.classList.add("rot13");
      }
    };
    return clone;
  }

  function rot13tweets(tweets) {
    for (var j = 0; j < tweets.length; j++) {
      var tweet = tweets[j];
      if (tweet) {
        rot13tweet(tweet);
      }
    };
  }

  function rot13tweet(tweet) {
    var text = tweet.querySelector(".tweet-text");
    if (text == null) return;
    var augment = rot13node(text);
    text.parentNode.insertBefore(augment, text.nextSibling);
  }

  // Get everything already on display
  rot13tweets(document.querySelectorAll(".tweet"));
}).call(this);
