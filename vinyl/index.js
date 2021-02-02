"use strict";

import { fadeIn, fadeOut } from "./fadeInFadeOut.js";

// compile the templates
const templates = {
  song: undefined,
  video: undefined,
  sound: undefined,
  markdown: undefined,
  url: undefined,
};

Object.keys(templates).map(function (key, index) {
  templates[key] = Handlebars.compile(
    document.getElementById(key + "-template").innerHTML
  );
});

const urlParams = new URLSearchParams(window.location.search);
const no_recursion = urlParams.get("no_recursion") || false;
const file = urlParams.get("data") || "index.json";

// http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
// -> Fisher–Yates shuffle algorithm
function shuffleArray(array) {
  var m = array.length,
    t,
    i;
  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

$(document).ready(function () {
  let $thePlayer = undefined;
  let $theButton = undefined;

  let vynilAnimation = (() => {
    const start = () => {
      $start_pause_button.children("img").attr("src", "./svgs/pause.svg");
      $("html").css({
        background: "url(./svgs/vinyl_rotating.svg) no-repeat center center",
        "background-size": "contain",
      });
      return "started";
    };
    const stop = () => {
      $start_pause_button.children("img").attr("src", "./svgs/play.svg");
      $("html").css({
        background: "url(./svgs/vinyl.svg) no-repeat center center",
        "background-size": "contain",
      });
      return "stopped";
    };
    const toggle = () => {
      if (
        $start_pause_button.children("img").attr("src") == "./svgs/pause.svg"
      ) {
        return stop();
      } else {
        return start();
      }
    };
    return {
      start: start,
      stop: stop,
      toggle: toggle,
    };
  })();

  //  destroy if exists
  function destroyiframeIfExists($button) {
    if ($thePlayer) {
      $thePlayer.remove();
      $thePlayer = undefined;
    }
    if ($theButton) {
      $theButton.html($theButton.data("text"));
      if (!$button || $theButton.prop("id") === $button.prop("id")) {
        $theButton = undefined;
        return undefined;
      }
    }
    if ($button) {
      $button.html("<span style='color:lightblue'>close ×</span>");
    }
    return $button;
  }

  function getStyleAndParentCard($button) {
    const $parentCard = $button.parents("div.card");
    const $img = $parentCard.children("img");
    const pos = $img.position();
    const oh = $img.outerHeight();
    const ow = $img.outerWidth();

    return {
      style: {
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: ow + "px",
        height: oh + "px",
        "background-color": "#212529",
      },
      $parentCard: $parentCard,
    };
  }

  function showiframe(e, template) {
    e.preventDefault();
    e.stopPropagation();

    // destroy
    vynilAnimation.stop();
    $theButton = destroyiframeIfExists($(e.currentTarget));

    if ($theButton) {
      // create
      if ($theButton.attr("class").indexOf("sound") != -1) {
        vynilAnimation.start();
      }
      const styleAndParentCard = getStyleAndParentCard($theButton);
      const iframe = template({
        id: $theButton.data("id"),
      });
      $thePlayer = $(iframe);
      styleAndParentCard.$parentCard.append(
        $thePlayer.css(styleAndParentCard.style)
      );
    }
  }

  function addEventHandlers() {
    $("div.card img.img-fluid").on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      $(e.currentTarget)
        .parent()
        .find(".btn-group button:first-child")
        .trigger("click");
    });

    $("div.card button.vid").on("click", (e) => showiframe(e, templates.video));
    $("div.card button.sound").on("click", (e) =>
      showiframe(e, templates.sound)
    );
    $("div.card button.markdown").on("click", (e) =>
      showiframe(e, templates.markdown)
    );
    $("div.card button.url").on("click", (e) => showiframe(e, templates.url));
  }

  function insertCards(datums, $parent) {
    const shuffle = shuffleArray([...datums.order]);

    shuffle.forEach((key) => {
      $parent.append(
        $(
          templates.song({
            key: key,
            val: datums.songs[key],
            covers: datums.covers || "covers",
            cover: () => {
              if (datums.songs[key].extension) {
                return key + datums.songs[key].extension;
              }
              if (key == "brouillard") {
                const random_boolean = Math.random() < 0.5;
                if (random_boolean) {
                  return "psycho_I.jpg";
                } else {
                  return "psycho_II.jpg";
                }
              }
              return key + ".jpg";
            },
          })
        )
      );
    });

    addEventHandlers();
  }

  const $start_pause_button = $("#start_pause_button");
  $start_pause_button.on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if ("stopped" == vynilAnimation.toggle()) {
      /* destroyiframeIfExists(); */
    }
  });

  // Assign handlers immediately after making the request,
  // and remember the jqxhr object for this request
  const jqxhr = $.get(file).done(function (data) {
    if (no_recursion && data.no_recursion) {
      const index = data.order.indexOf(data.no_recursion);
      if (index > -1) {
        data.order.splice(index, 1);
      }
    }

    if (data.title) {
      $("title").text(data.title);
      const styleTemplate = Handlebars.compile(
        document.getElementById("style-template").innerHTML
      );
      $("head").append(styleTemplate(data.title));
    }

    if (data.copyright) {
      $("#copyright").text(data.copyright);
    }

    if (!data.openGraphHeader) {
      $("#vinyl_share").remove();
    } else {
      $.get(data.openGraphHeader).done(function (header) {
        $("head").append($(header));
      });
    }

    if (data.navbarheader) {
      $.get(data.navbarheader).done(function (header) {
        $("#navbarHeader").prepend($(header));
      });
    }

    if (data.icon) {
      $("#vinyl_brand img").attr("src", data.icon);
    }

    if (!data.animated_background) {
      vynilAnimation = (() => { });
      $("#start_pause_button").remove();
    }

    const $row = $("#songs");
    insertCards(data, $row);
    fadeIn($row.children(".col"), 111, () => {});

    $("#shuffle_button").on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fadeOut($row.children(".col"), 333, () => {
        $row.empty();
        insertCards(data, $row);
        fadeIn($row.children(".col"), 666, () => {}, shuffleArray);
      });
    });
  });
});
