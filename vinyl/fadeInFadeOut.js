export function fadeIn($elements, delay, eventually, shuffle) {
  let elem = $elements.toArray().map((element) => element);
  const opacity = 1;

  if (shuffle) {
    shuffle(elem);
  }

  const last = () => {
    if (eventually) {
      eventually();
    }
  };

  /* 

  // elegant, but jquery callback explose on requestAnimationFrame
    elem
    .reduce((acc, e) => Promise.resolve(acc).then((a) => $(e).fadeTo(delay, opacity, a)), undefined)
    .then(last);
  */

  $(elem[0]).fadeTo(delay, opacity, () => {
    $(elem[1]).fadeTo(delay, opacity, () => {
      $(elem[2]).fadeTo(delay, opacity, () => {
        $(elem[3]).fadeTo(delay, opacity, () => {
          $(elem[4]).fadeTo(delay, opacity, () => {
            $(elem[5]).fadeTo(delay, opacity, () => {
              $(elem[6]).fadeTo(delay, opacity, () => {
                $(elem[7]).fadeTo(delay, opacity, () => {
                  $(elem[8]).fadeTo(delay, opacity, () => {
                    $(elem[9]).fadeTo(delay, opacity, () => {
                      $(elem[10]).fadeTo(delay, opacity, () => {
                        $(elem[11]).fadeTo(delay, opacity, last);
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
