module.exports = (() => {
  class NodeIterator {
    constructor(nodeList) {
      this.nodeList = (nodeList == undefined) ? [] : nodeList;
    }

    [Symbol.iterator]() {
      let cur = -1;
      let nodeList = this.nodeList;
      return {
        next() {
          cur += 1;
          if (cur < nodeList.length) {
            return { done: false, value: nodeList[cur] };
          } else {
            return { done: true };
          }
        }
      }
    }
  }
  Object.defineProperty(NodeList.prototype, "iterator", {
    get() {
      return new NodeIterator(this);
    }
  });

  return { NodeIterator };
}).call();
