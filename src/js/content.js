(function () {
  const DEBUG = true;

  if (DEBUG) {
    // Twitter likes to remove this
    delete window.console;
    console.log("Loading");
  }

  let Dancer = require("./dancer");
  let rot13 = require("./rot13");

  Dancer.register("js-more-ProfileTweet-actions", {
    init: function() {
      var li = document.createElement("li");
      li.setAttribute("role", "presentation");
      li.classList.add("rot13-button");
      var button = document.createElement("button");
      li.appendChild(button);
      button.setAttribute("role", "menuitem");
      button.setAttribute("class", "dropdown-link");
      button.innerText = "rot13 " + this.dancerId;
      this.li = li;
      this.button = button;
    },
    attach: function () {
      // Purge
      this.detach();

      this.getMenu().appendChild(this.li);
      this.button.addEventListener('click', this.click.bind(this));
    },
    detach: function () {
      var rot13 = this.element.closest(".tweet").querySelector(".rot13");
      if (rot13) rot13.remove();
      var li = this.getMenu().querySelector("li.rot13-button");
      if (li) li.remove();
    },
    click: function () {
      var rot13elem = this.element.closest(".tweet").querySelector(".rot13");
      if (rot13elem) {
        rot13elem.remove();
      } else {
        rot13.rot13tweet(this.element.closest(".tweet"));
      }
    },
    getMenu: function () {
      return this.element.querySelector("div.dropdown > div.dropdown-menu > ul");
    }
  });
  Dancer.observe(document.body);

}).call(this);
