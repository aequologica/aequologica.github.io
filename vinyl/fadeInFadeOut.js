function isElementFullInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0
    &&
    rect.left >= 0
    &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
  );
}

function isElementPartInViewport(el) {
  var box = el.getBoundingClientRect();

  return !(
    (window.innerHeight || document.documentElement.clientHeight) < box.top 
    ||
    box.bottom < 0
    ||
    (window.innerWidth || document.documentElement.clientWidth) < box.left
    ||
    box.right < 0
  );
}

function delayIfVisible(el, delay) {
  if (isElementPartInViewport(el)) {
    console.log(delay, el);
    return delay;
  } else { 
    console.log(0, el);
    return 0;
  };
}

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

  

  // // elegant, but something must be missing, animations are not queued
  //   elem
  //     .reduce((acc, e) => Promise.resolve(acc).then((a) => $(e).fadeTo( delayIfVisible(e, delay), opacity, () => a)), undefined)
  //     .then(last);
  
  // respirons à fond !
  $(elem[0]).fadeTo( delayIfVisible(elem[0], delay), opacity, () => { 
    $(elem[1]).fadeTo( delayIfVisible(elem[1], delay), opacity, () => { 
      $(elem[2]).fadeTo( delayIfVisible(elem[2], delay), opacity, () => { 
        $(elem[3]).fadeTo( delayIfVisible(elem[3], delay), opacity, () => { 
          $(elem[4]).fadeTo( delayIfVisible(elem[4], delay), opacity, () => { 
            $(elem[5]).fadeTo( delayIfVisible(elem[5], delay), opacity, () => { 
              $(elem[6]).fadeTo( delayIfVisible(elem[6], delay), opacity, () => { 
                $(elem[7]).fadeTo( delayIfVisible(elem[7], delay), opacity, () => { 
                  $(elem[8]).fadeTo( delayIfVisible(elem[8], delay), opacity, () => { 
                    $(elem[9]).fadeTo( delayIfVisible(elem[9], delay), opacity, () => { 
                      $(elem[10]).fadeTo( delayIfVisible(elem[10], delay), opacity, () => { 
                        $(elem[11]).fadeTo( delayIfVisible(elem[11], delay), opacity,
                          last
                        );
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
  // ouf !

}
  

export function fadeOut($elements, delay, eventually) {
  $elements.fadeTo(delay, 0, () => {});
  if (eventually) {
    eventually();
  }
}
