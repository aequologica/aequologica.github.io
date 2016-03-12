jQuery( document ).ready(function() {

  // build chord table + insert in DOM 
  (function(){

    var template = `
      <div class="table" id="adagio">
        <div class="A numbe"></div>
        <div class="A harmo"></div>
        <div class="B numbe"></div>
        <div class="B harmo"></div>
        <div class="C numbe"></div>
        <div class="C harmo"></div>
      </div>
    `;

    var $table = jQuery(template);
debugger;
    var adagio = {
      A: [
        { clazz : 'exp'      , chords : [ 'Am'     , ''    , 'Esus4'     , 'E'       ] },
        { clazz : 'exp'      , chords : [ 'Am'     , ''    , 'F6'        , 'Bdim'    ] },
        { clazz : 'exp'      , chords : [ 'E7'     , 'Am'  , 'D6'        , 'E7'      ] },
        { clazz : 'mod_rel'  , chords : [ 'Am'     , 'F/A' , 'G7/B'      , 'G6'      ] },
        { clazz : 'mod_rel'  , chords : [ 'C'      , 'Am'  , 'F6'        , 'G7'      ] },
        { clazz : 'mod_ou'   , chords : [ 'C'      , 'Am'  , 'D7/F#'     , 'D6'      ] },
        { clazz : 'mod_ou'   , chords : [ 'G'      , 'Gm'  , 'C#7dim'    , 'A7'      ] },
        { clazz : 'mod_ou'   , chords : [ 'D7/C'   , 'G/B' , 'A7/C#'     , 'Dm6'     ] },
        { clazz : 'mar_har'  , chords : [ 'Em/G'   , ''    , 'Am/C'      , ''        ] },
        { clazz : 'mar_har'  , chords : [ 'F#m7b5' , ''    , 'B7'        , ''        ] },
        { clazz : 'coda'     , chords : [ 'Em'     , ''    , 'Am'        , 'D#dim/F#'] },
        { clazz : 'coda'     , chords : [ 'B7'     , 'Em'  , 'Am6'       , 'B'       ] },
      ],
      B: [
        { clazz : 'exp'      , chords : [ 'Em'    , ''      , 'Bsus4'    , 'B'       ] },
        { clazz : 'mod_relB' , chords : [ 'Em'    , ''      , 'Am'       , 'D7'      ] },
        { clazz : 'dev'      , chords : [ 'G'     , 'Em7b5' , 'A7'       , ''        ] },
        { clazz : 'dev'      , chords : [ 'Dm'    , 'Bb'    , 'Gm6'      , 'A7'      ] },
        { clazz : 'dev'      , chords : [ 'Dm'    , 'Bb'    , 'Gm6'      , 'C7'      ] },
        { clazz : 'mod_ouB'  , chords : [ 'F'     , 'Dm'    , 'G7/B'     , 'G6'      ] },
        { clazz : 'mod_ouB'  , chords : [ 'C'     , 'Cm'    , 'F#7dim'   , 'D7'      ] },
        { clazz : 'mod_ouB'  , chords : [ 'G7/F'  , 'C/E'   , 'D7/F#'    , 'Gm6'     ] },
        { clazz : 'mar_har'  , chords : [ 'Am/C'  , ''      , 'Em/F'     , ''        ] },
        { clazz : 'mar_har'  , chords : [ 'B#m7b5', ''      , 'E7'       , ''        ] },
        { clazz : 'coda'     , chords : [ 'Am'    , ''      , 'Dm'       , 'G#dim/B' ] },
        { clazz : 'coda'     , chords : [ 'E7'    , 'Am'    , 'Dm6'      , 'E7'      ] },
      ],
      C:[
        { clazz : 'fin'      , chords : [ 'Am'    , 'F'     , 'Bb'       , 'Gm'      ] },
        { clazz : 'fin'      , chords : [ 'C'     , 'Bdim'  , 'Csus4'    , 'C'       ] },
        { clazz : 'fin'      , chords : [ 'F'                                        ] },
      ],
    };

    var measure = 1;

    for (var partie in adagio) { // A, B, C
      if (adagio.hasOwnProperty(partie)) {

        $table.find('.'+partie+'.numbe').append(jQuery('<div>').attr("id", partie).addClass("header").html("&nbsp;"+partie+"&nbsp;"));
        $table.find('.'+partie+'.harmo'  ).append(jQuery('<div>'));

        _.forEach(adagio[partie], function(value, key) {
          $table.find('.'+partie+'.numbe').append(jQuery('<div>').addClass(value.clazz).text(measure++));
          var $d = jQuery('<div>');
          _.forEach(value.chords, function(chord) {
            $d.append(jQuery('<span>').text(chord));
          });
          $table.find('.'+partie+'.harmo').append(jQuery('<div>').addClass(value.clazz).html($d));
        });
      }
    }

    jQuery('#wrapperForHorizontalScrolling').append($table);

  })();


  // chord table is in a footer, adjust body height 
  (function(){

    function setBodyMarginBottom() {
      var footerHeight = jQuery('footer').css('height');
      jQuery('body').css("margin-bottom", footerHeight);
    }

    jQuery( window ).resize(function() {
      setBodyMarginBottom();
    });

    setBodyMarginBottom();

  })();

  // save checkbox state locally 
  (function(){
    jQuery('input:checkbox').each(function() {

      if (Modernizr.localstorage) {
        var $this = jQuery(this);
        var data = window.localStorage.getItem($this.attr('id'));
        if (data === "true") {
          $this.prop('checked', true);
        } else if (data === "false") {
          $this.prop('checked', false);
        } else {  
        }
      }
    });
      
    jQuery('input:checkbox').change(function(event) {
      if (Modernizr.localstorage) {
        var $this = jQuery(this);
        window.localStorage.setItem($this.attr('id'), this.checked);
      }
    });
  })();
    
  /* ´set up clazzes colors and background color change on hover */
  (function(){
    function ColorLuminance(hex, lum) {

      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];  
      }
      lum = lum || 0;

      // convert to decimal and change luminosity
      var rgb = "#", color, i;
      for (i = 0; i < 3; i++) {
        color = parseInt(hex.substr(i*2,2), 16);
        color = Math.round(Math.min(Math.max(0, color + (color * lum)), 255)).toString(16);
        rgb += ("00"+color).substr(color.length);
      }

      return rgb;
    }

    function rgbToHex(color) {
      var bg = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
      }
      return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
    }

    _.forEach([".exp", ".mod_rel", ".mod_relB", ".dev", ".mod_ou", ".mod_ouB", ".mar_har", ".coda", ".fin"], function( clazz ){

      _.forEach( jQuery(clazz), function(instance) {
        $this = jQuery(instance);
        $bg_color = rgbToHex($this.css('background-color'));
        $bg_color_alt = ColorLuminance($bg_color, 0.12);
        $this.data( {'data-bg'    : $bg_color} );
        $this.data( {'data-bg-alt': $bg_color_alt } );
      });

      jQuery( "#legend " + clazz ).add( ".fwyc" + clazz ).hover(
        function() {
          _.forEach( jQuery(clazz), function(instance) {
            $this = jQuery(instance);
            $this.css( {'background-color': $this.data( 'data-bg-alt')} );
          });
        }, function() {
          _.forEach( jQuery(clazz), function(instance) {
            $this = jQuery(instance);
            $this.css( {'background-color': $this.data( 'data-bg')} );
          });
        }
      );

    });
  })();

  /* sound cloud */
  (function(){
    var ticks = [
      0,
      1891.332,
      3168.911,
      4585.209,
      5943.462,
      7348.151,
      8729.033,
      10122.702,
      11491.975,
      12931.491,
      14289.744,
      15683.413,
      17064.884,
      18527.618,
      19967.134,
      21383.432,
      22810.75,
      24250.266,
      25585.89,
      27048.035,
      28406.877,
      29881.22,
      31320.736,
      32760.252,
      34199.768,
      35639.284,
      37089.82,
      38529.336,
      39806.915,
      41246.431,
      42708.576,
      44125.463,
      45541.761,
      47004.495,
      48408.595,
      49883.527,
      51206.364,
      52727.143,
      54085.396,
      55548.13,
      56999.844,
      58462.578,
      59844.049,
      61283.565,
      62665.036,
      64139.379,
      65683.376,
      67041.629,
      68526.992,
      69984.216,
      71441.44,
      72904.174,
      74285.056,
      75736.77,
      77106.043,
      78603.604,
      80020.491,
      81424.591,
      82899.523,
      84315.821,
      85720.51,
      87182.655,
      88599.542,
      90062.276,
      91478.574,
      92918.09,
      94299.561,
      95739.077,
      97097.33,
      98560.064,
      99976.362,
      101415.878,
      102774.131,
      104155.602,
      105537.073,
      106883.128,
      108380.689,
      109843.423,
      111295.137,
      112676.608,
      114058.079,
      115497.595,
      116960.329,
      118422.474,
      119816.143,
      121174.396,
      122613.912,
      123972.165,
      125480.746,
      126920.262,
      128302.731,
      129741.249,
      131180.765,
      132574.434,
      134118.431,
      135511.511,
      136974.245,
      138680.179,
      140131.893,
      141571.409,
      142940.682,
      144415.614,
      145971.22,
      147596.48,
      150231.723,
      158114.234,
    ];

    ticks = _.transform(ticks, function(result, n) {
      result.push(Math.floor(n));
      return true;
    }, []);

    function getChordsOffsetFromIndex(iChord, dim) {
      var ret = {
      	start : ticks[iChord],
      	stop  : ticks[iChord + dim],
      };
      // console.log(ret.start, ret.stop);
      return ret;
    }

    function getChordIndexFromOffset(position) {
    	return _.sortedIndex(ticks, position)-1;
    }

    var widgetIframe = document.getElementById('sc-widget'),
        widget       = SC.Widget(widgetIframe);

    var clickQueue = [];

    /*
    $('textarea').on('click', function(e) {
      $ta = $(this);
      widget.getPosition(function(currentPosition){
      	$ta.append(currentPosition + "\n");
      });
    });
    */

    var fader = function () {
      var nIntervId;
      
      function stopFade() {
        widget.pause();
        widget.setVolume(1);
        if (nIntervId) {
          clearInterval(nIntervId);
          nIntervId = undefined;
        }
      }

      function fadeUntilStop() {

        var fadingVolume;
     
        function setFadeInterval() {
          nIntervId = setInterval(stepFade, 50);
        }

        function stepFade() {
          fadingVolume -= .05;
          if (fadingVolume <= 0){
            fadingVolume = 0;
            stopFade();
            return;
          }
          // console.log("fadingVolume SET TO", fadingVolume);
          widget.setVolume(fadingVolume);
        }

        widget.getVolume(function(volume){
          if (nIntervId) {
            return;
          }
          // console.log("fader started started", "original volume IS", volume);
          fadingVolume = volume;
          setFadeInterval();
        });
      }

      return {
        start : fadeUntilStop,
        stop : stopFade,
      }
    }();

    widget.bind(SC.Widget.Events.READY, function() {

      widget.setVolume(1);

      // ugly workaround to cope with seek not working on first click : play, then stop just a little bit after
      widget.play();
      setTimeout(function(){ widget.pause(); }, 10);

      widget.bind(SC.Widget.Events.PAUSE, function() {
        // console.log("clickQueue about to SHIFT", JSON.stringify(clickQueue));
        var removedClick = clickQueue.shift(); // remove first element
        // console.log("paused", "clickQueue", JSON.stringify(clickQueue));
        if (removedClick && removedClick.id) {
          // immediate visual feedback
          jQuery("#"+removedClick.id).removeClass("playFeedback");
        }
        jQuery("#legend .fa").removeClass("fa-volume-off fa-volume-up").addClass("fa-volume-up");
      });
      
      widget.bind(SC.Widget.Events.ERROR, function(err) {
        console.log("error", err);
      });

      widget.bind(SC.Widget.Events.PLAY, function() {
        // console.log("played", "clickQueue", JSON.stringify(clickQueue));
      });
      
      widget.bind(SC.Widget.Events.SEEK, function(e) {
        // console.log('New seek position: '+e.currentPosition);
      });

      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {

        widget.getPosition(function(currentPosition){

          // console.log("currentPosition", currentPosition);
          if (clickQueue.length > 0) { 
            if (currentPosition > clickQueue[0].stop) {
              fader.start();
            }
          }

          // r.à.z display
          _.forEach( jQuery("div.table#adagio > div > div > div > span"), function(value) {
            jQuery(value).css( {'background-color': 'inherit'} );
          });

          // calc chord id from position
          var iChord = getChordIndexFromOffset(currentPosition);
          if (iChord != -1) {
            var $gotTheChord = jQuery("#"+"chord"+iChord);
            if ($gotTheChord.length > 0) {

              var alternateBackgroundColor = $gotTheChord.parent().parent().data( 'data-bg-alt');
              $gotTheChord.css( {'background-color': alternateBackgroundColor} );

              if (jQuery("#sync_scroll_2_play:checked").length > 0) {
                var $scrollToElement;
                if ($gotTheChord.parent().parent().prev().length < 1 ) {
                  $scrollToElement = $gotTheChord.parent().parent();
                } else {
                  $scrollToElement = $gotTheChord.parent().parent().prev();
                }
                jQuery('#wrapperForHorizontalScrolling').scrollTo($scrollToElement);
              }
            }
          }
        });
      });
      
    });

    /* chords offsets */
    var $chords = jQuery("div.table#adagio > div > div > div > span");
    for(i=0; i<$chords.length;i++) {
        $this = jQuery($chords[i]);
        $this.prop("id", "chord"+i);
        var range = getChordsOffsetFromIndex(i, 1);
        $this.data("position", range.start);
        $this.data("stop", range.stop);
    };

    // show that we are on first chord
    var $startChord = jQuery('span#chord0');
    var alternateBackgroundColor = $startChord.parent().parent().data( 'data-bg-alt');
    $startChord.css( {'background-color': alternateBackgroundColor} );

    /* bars offsets */
    var $bars = jQuery("div.table#adagio > div.numbe > div").not(".header"); 
    for(i=0; i<$bars.length;i++) {
        $this = jQuery($bars[i]);
        $this.prop("id", "bar"+i);
        var range = getChordsOffsetFromIndex(i*4, 4);
        $this.data("position", range.start);
        $this.data("stop", range.stop);
    };

    /* parts offsets */
    var $parts = jQuery(".header");
    for(i=0; i<$parts.length;i++) {
        $this = jQuery($parts[i]);
        $this.prop("id", "part"+i);
        var range = getChordsOffsetFromIndex(i*4*12, 4*12);
        $this.data("position", range.start);
        $this.data("stop", range.stop);
    };

    jQuery.each(jQuery("#legend .fa"), function(index) {
      $this = jQuery(this);
      var start = undefined, 
          stop  = undefined;
      var tex = $this.text().trim();
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
        var range = getChordsOffsetFromIndex(start*4, (stop-start)*4);
        $this.data("position", range.start);
        $this.data("stop", range.stop);
      } else {
        $this.removeClass("fa fa-volume-up");
      }
    });

    jQuery("div.table > div.numbe > div").add("div.table#adagio > div > div > div > span").add(".fa-volume-up")
      .click(function() {

        if (clickQueue.length > 0) {
  
          // immediate visual feedback
          jQuery("#"+clickQueue[0].id).removeClass("playFeedback");
  
          if (clickQueue[0].id == jQuery(this).attr('id')) {
            fader.start(); 
            return;
          }
        }
        
        $this = jQuery(this);
        var pos = $this.data("position");

        if (typeof pos !== "undefined" && pos != null) {

          // immediate visual feedback
          $this.addClass("playFeedback");
          if ($this.hasClass("fa")) {
            $this.removeClass("fa-volume-up").addClass("fa-volume-off");
          }

          fader.stop();
          widget.pause();
          widget.seekTo(pos);
          widget.play();

          clickQueue.push({
            stop : $this.data("stop"), 
            id   : $this.attr('id')
          });
          // console.log("clickQueue PUSH", JSON.stringify(clickQueue));

        }
    });

  }()); /* sound cloud */

}); // jquery document ready
