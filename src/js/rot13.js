module.exports = (() => {
  let NodeIterator = require("./NodeIterator");

  function rotate(a) {
    let aPoint = a.codePointAt(0);
    return function(letter) {
      return String.fromCodePoint((letter.codePointAt(0) - aPoint + 13) % 26 + aPoint);
    }
  }

  function rot13(text) {
    return text.replace(/[A-Z]/g, rotate("A")).replace(/[a-z]/g, rotate("a"));
  }

  function rot13tweet(tweet) {
    let tweetText = tweet.querySelector(".tweet-text");
    let clone = tweetText.cloneNode(true);
    for (let node of clone.childNodes.iterator) {
      if (node.nodeType == Node.TEXT_NODE) {
        clone.replaceChild(new Text(rot13(node.textContent)), node);
      }
    }
    clone.classList.add("rot13");
    tweetText.parentNode.insertBefore(clone, tweetText);
    return clone;
  }

  return {
    rot13,
    rot13tweet
  };
})();
