"use strict";
module.exports = (() => {
  function rotate(a) {
    let aPoint = a.codePointAt(0);
    return function(letter) {
      return String.fromCodePoint((letter.codePointAt(0) - aPoint + 13) % 26 + aPoint);
    }
  }

  function rot13(text) {
    return text.replace(/[A-Z]/g, rotate("A")).replace(/[a-z]/g, rotate("a"));
  }

  return {
    rot13
  };
})();
