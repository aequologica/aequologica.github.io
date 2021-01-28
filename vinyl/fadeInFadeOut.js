export function fadeIn($elements, delay, eventually, shuffle) {
  let elem = $elements.toArray().map((element) => element);
  const opacity = 1;

  if (shuffle) {
    shuffle(elem);
  }

  $(elem[0]).fadeTo(delay, opacity, function () {
    $(elem[1]).fadeTo(delay, opacity, function () {
      $(elem[2]).fadeTo(delay, opacity, function () {
        $(elem[3]).fadeTo(delay, opacity, function () {
          $(elem[4]).fadeTo(delay, opacity, function () {
            $(elem[5]).fadeTo(delay, opacity, function () {
              $(elem[6]).fadeTo(delay, opacity, function () {
                $(elem[7]).fadeTo(delay, opacity, function () {
                  $(elem[8]).fadeTo(delay, opacity, function () {
                    $(elem[9]).fadeTo(delay, opacity, function () {
                      $(elem[10]).fadeTo(delay, opacity, function () {
                        $(elem[11]).fadeTo(delay, opacity, function () {
                          if (eventually) {
                            eventually();
                          }
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

export function fadeOut($elements, delay, eventually) {
  $elements.fadeTo(delay, 0, () => {
    if (eventually) {
      eventually();
    }
  });
}
