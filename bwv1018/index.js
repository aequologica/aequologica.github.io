$( document ).ready(function() {

  var tout = {
    A: [
      {c: "exp"     , h: ["Am"     , ""    , "Esus4"     , "E"        ,]},
      {c: "exp"     , h: ["Am"     , ""    , "F6"        , "Bdim"     ,]},
      {c: "exp"     , h: ["E7"     , "Am"  , "D6"        , "E7"       ,]},
      {c: "mod_rel" , h: ["Am"     , "F/A" , "G7/B"      , "G6"       ,]},
      {c: "mod_rel" , h: ["C"      , "Am"  , "F6"        , "G7"       ,]},
      {c: "mod_ou"  , h: ["C"      , "Am"  , "D7/F#"     , "D6"       ,]},
      {c: "mod_ou"  , h: ["G"      , "Gm"  , "C#7dim"    , "A7"       ,]},
      {c: "mod_ou"  , h: ["D7/C"   , "G/B" , "A7/C#"     , "Dm6"      ,]},
      {c: "mar_har" , h: ["Em/G"   , ""    , "Am/C"      , ""         ,]},
      {c: "mar_har" , h: ["F#m7b5" , ""    , "B7"        , ""         ,]},
      {c: "coda"    , h: ["Em"     , ""    , "Am"        , "D#dim/F#" ,]},
      {c: "coda"    , h: ["B7"     , "Em"  , "Am6"       , "B"        ,]},
    ], 
    B: [ 
      {c: "exp"     , h: ["Em"    , ""      , "Bsus4"    , "B"        ,]},
      {c: "mod_rel" , h: ["Em"    , ""      , "Am"       , "D7"       ,]},
      {c: "dev"     , h: ["G"     , "Em7b5" , "A7"       , ""         ,]},
      {c: "dev"     , h: ["Dm"    , "Bb"    , "Gm6"      , "A7"       ,]},
      {c: "dev"     , h: ["Dm"    , "Bb"    , "Gm6"      , "C7"       ,]},
      {c: "mod_ou"  , h: ["F"     , "Dm"    , "G7/B"     , "G6"       ,]},
      {c: "mod_ou"  , h: ["C"     , "Cm"    , "F#7dim"   , "D7"       ,]},
      {c: "mod_ou"  , h: ["G7/F"  , "C/E"   , "D7/F#"    , "Gm6"      ,]},
      {c: "mar_har" , h: ["Am/C"  , ""      , "Em/F"     , ""         ,]},
      {c: "mar_har" , h: ["B#m7b5", ""      , "E7"       , ""         ,]},
      {c: "coda"    , h: ["Am"    , ""      , "Dm"       , "G#dim/B"  ,]},
      {c: "coda"    , h: ["E7"    , "Am"    , "Dm6"      , "E7"       ,]},
    ], 
    C:[ 
      {c: "fin"     , h: ["Am"    , "F"     , "Bb"       , "Gm"       ,]},
      {c: "fin"     , h: ["C "    , "Bdim"  , "Csus4"    , "C"        ,]},
      {c: "fin"     , h: ["F "                                         ]},
    ] 
  };

  var measure = 1;
  for (var k in tout) {
    if (tout.hasOwnProperty(k)) {

      $('#harmo .'+k+'.numbers').append($('<div>').attr("id", k).addClass("header").html("&nbsp;"+k+"&nbsp;"));
      $('#harmo .'+k+'.harmo'  ).append($('<div>'));

      $.each(tout[k], function(key, value) {
        $('#harmo .'+k+'.numbers').append($('<div>').addClass(""+value.c).text(measure++));
        var $d = $('<div>');
        $.each(value.h, function(key2, value2) {
          $d.append($('<span>').text(value2));
        });
        $('#harmo .'+k+'.harmo').append($('<div>').addClass(""+value.c).html($d));
      });
    }
  }

  function setBodyMarginBottom() {
    var footerHeight = $('footer').css('height');
    $('body').css("margin-bottom", footerHeight);
  }

  $( window ).resize(function() {
    setBodyMarginBottom();
  });

  setBodyMarginBottom();

  $('input:checkbox').each(function() {
    if (Modernizr.localstorage) {
      var data = window.localStorage.getItem($(this).attr('id'));
      if (data === "true") {
        $(this).prop('checked', true);
      } else if (data === "false") {
        $(this).prop('checked', false);
      } else {  
      }
    }
  });
    
  $('input:checkbox').change(function(event) {
    if (Modernizr.localstorage) {
      window.localStorage.setItem($(this).attr('id'), this.checked);
    }
  });
    
  function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];  
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  }

  function rgbToHex(color) {
    var bg = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return     "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
  }

  $.each([".exp", ".mod_rel", ".dev", ".mod_ou", ".mar_har", ".coda", ".fin"], function( index, value ){

    $.each( $(value), function() {
      $bg_color = rgbToHex($( this ).css('background-color'));
      $bg_color_alt = ColorLuminance($bg_color, 0.12);
      $( this ).data( {'data-bg'    : $bg_color} );
      $( this ).data( {'data-bg-alt': $bg_color_alt } );
    });

    $( "#legend " + value ).add(".func" + value).hover(
      function() {
        $.each( $(value), function() {
          $( this ).css( {'background-color': $( this ).data( 'data-bg-alt')} );
        });
      }, function() {
        $.each( $(value), function() {
          $( this ).css( {'background-color': $( this ).data( 'data-bg')} );
        });
      }
    );

  });

  (function(){

    var length = 227000.0;
    var noire = length/(26.0*4.0);
    var playing = false;

    var widgetIframe = document.getElementById('sc-widget'),
        widget       = SC.Widget(widgetIframe);

    var stop = null;

    widget.bind(SC.Widget.Events.READY, function() {

      // ugly workaround to cope with seek not working on first click : play, then stop just a little bit after
      widget.play();
      setTimeout(function(){ widget.pause(); }, 10);

      widget.bind(SC.Widget.Events.PAUSE, function() {
        playing = false;
        $("#legend .fa").removeClass("fa-volume-off fa-volume-up").addClass("fa-volume-up");
        stop = null;
      });
      
      widget.bind(SC.Widget.Events.PLAY, function() {
        playing = true;
      });
      
      widget.bind(SC.Widget.Events.SEEK, function(e) {
        // console.log('New seek position: '+e.currentPosition);
      });

      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {

        widget.getPosition(function(currentPosition){
          if (stop != null) { 
            if (currentPosition > stop) {
              widget.pause();
            }
          }

          // r.à.z display
          $.each( $("div.table#harmo > div > div > div > span"), function(index, value) {
            $(value).css( {'background-color': 'inherit'} );
          });

          // calc chord id from position
          var $gotTheChord = $("#"+"chord"+Math.floor(currentPosition/noire));
          if ($gotTheChord.length > 0) {

            var alternateBackgroundColor = $gotTheChord.parent().parent().data( 'data-bg-alt');
            $gotTheChord.css( {'background-color': alternateBackgroundColor} );

            if ($("#sync_scroll_2_play:checked").length > 0) {
              var $scrollToElement;
              if ($gotTheChord.parent().parent().prev().length < 1 ) {
                $scrollToElement = $gotTheChord.parent().parent();
              } else {
                $scrollToElement = $gotTheChord.parent().parent().prev();
              }
              $('.harmoTableWrapperForHorizontalScrolling').scrollTo($scrollToElement);
            }
          }
        });
      });
      
    });

    /* chords offsets */
    $.each($("div.table#harmo > div > div > div > span"), function(index) {
        $(this).prop("id", "chord"+index);
        var offset = Math.round(noire*index); 
        $(this).data("position", offset);
        $(this).data("stop", offset + noire + (noire/8));
    });

    // show that we are on first chord
    var $startChord = $('span#chord0');
    var alternateBackgroundColor = $startChord.parent().parent().data( 'data-bg-alt');
    $startChord.css( {'background-color': alternateBackgroundColor} );

    /* bars offsets */
    $.each($("div.table#harmo > div.numbers > div").not(".header"), function(index) {
        $(this).prop("id", "bar"+index);
        var offset = Math.round(index*(noire  *4)); 
        $(this).data("position", offset);
        $(this).data("stop", offset + (4*noire) + (noire/8));
    });

    /* parts offsets */
    $.each($(".header"), function(index) {
        $(this).prop("id", "part"+index);
        var offset = Math.round(index*(noire*4*12)); 
        $(this).data("position", offset);
        $(this).data("stop", offset + (noire*4*12) + (noire/8));
    });

    $.each($("#legend .fa"), function(index) {
      var start = undefined, 
          stop  = undefined;
      var tex = $(this).text().trim();
      var match = /(\d+)\-(\d+)/gmi.exec(tex);
      if (match && match.length > 2) {
        start = match[1] - 1;
        stop  = match[2];
      } else {
        match = /(\d+)/gmi.exec(tex);
        if (match && match.length > 1) {
          start = match[1] - 1;
          stop  = match[1];
        } else {
          console.log("["+tex+"]", "not matched!");
        }
      }
      if (!(typeof start === "undefined") && 
          !(typeof stop  === "undefined")) {
        var offsetStart = Math.round(noire*4*start); 
        var offsetStop  = Math.round(noire*4*stop); 
        $(this).data("position", offsetStart);
        $(this).data("stop"    , offsetStop + noire/8);
      } else {
        $(this).removeClass("fa fa-volume-up");
      }
    });

    var clickedID = undefined;

    $("div.table > div.numbers > div").add("div.table#harmo > div > div > div > span").add(".fa-volume-up")
      .click(function() {
        if (clickedID && clickedID == $(this).attr('id')) {
          widget.pause();
          clickedID = undefined;
        } else {
          var pos = $(this).data("position");
          if (typeof pos !== "undefined" && pos != null) {
            clickedID = $(this).attr('id');
            console.log(clickedID, "ON");
            widget.pause();
            widget.seekTo(pos);
            widget.play();
            stop = Math.round($(this).data("stop"));
            if ($(this).hasClass("fa")) {
              var $this = $(this);
              setTimeout(function() {
                $this.removeClass("fa-volume-up").addClass("fa-volume-off");
              },
              100);
            }
          }
        }
    });


  }());


  
});
