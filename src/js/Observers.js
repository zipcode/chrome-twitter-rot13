module.exports = (function() {
  function addRemoveObserver(addHandler, removeHandler, classHandler) {
    let observer = new MutationObserver((records, self) => {
      for (let record of records) {
        if (addHandler) {
          for (let node of record.addedNodes.iterator) {
            addHandler(node, record);
          }
        }
        if (removeHandler) {
          for (let node of record.removedNodes.iterator) {
            removeHandler(node, record);
          }
        }
        if (classHandler) {
          if (record.attributeName == "class") {
            classHandler(record.target, record);
          }
        }
      }
    });
    let observe = observer.observe;
    function wrap(element, options) {
      if (options == undefined) {
        options = {};
      }
      if (!options.childList) {
        options.childList = true;
      }
      if (!options.attributes) {
        options.attributes = true;
        options.attributeFilter = ["class"];
        options.attributeOldValue = true;
      }
      observe.call(observer, element, options);
    }
    observer.observe = wrap;

    return observer;
  }

  return { "addRemoveObserver": addRemoveObserver }
})();
