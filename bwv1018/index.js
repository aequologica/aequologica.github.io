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

function getChordsOffsetFromIndex(iChord, dim, log) {
  var ret = {
  	start : ticks[iChord],
  	stop  : ticks[iChord + dim],
  };
  if (log) console.log(ret.start, ret.stop);
  return ret;
}

function getChordIndexFromOffset(position) {
	return _.sortedIndex(ticks, position)-1;
}

    var playing = false;

    var widgetIframe = document.getElementById('sc-widget'),
        widget       = SC.Widget(widgetIframe);

    var stop = null;
    $('textarea').on('click', function(e) {
      $ta = $(this);
      widget.getPosition(function(currentPosition){
      	$ta.append(currentPosition + "\n");
      });

    });

    widget.bind(SC.Widget.Events.READY, function() {

      // ugly workaround to cope with seek not working on first click : play, then stop just a little bit after
      widget.play();
      setTimeout(function(){ widget.pause(); }, 10);

      widget.bind(SC.Widget.Events.PAUSE, function() {
        playing = false;
        console.log("paused");
        $("#legend .fa").removeClass("fa-volume-off fa-volume-up").addClass("fa-volume-up");
        stop = null;
      });
      
      widget.bind(SC.Widget.Events.PLAY, function() {
        playing = true;
        console.log("played");
      });
      
      widget.bind(SC.Widget.Events.SEEK, function(e) {
        // console.log('New seek position: '+e.currentPosition);
      });

      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function() {

        widget.getPosition(function(currentPosition){

          // console.log(currentPosition);
          if (typeof stop !== "undefined" && stop != null) { 
            if (currentPosition > stop) {
              widget.pause();
            }
          }

          // r.à.z display
          $.each( $("div.table#harmo > div > div > div > span"), function(index, value) {
            $(value).css( {'background-color': 'inherit'} );
          });

          // calc chord id from position
          var iChord = getChordIndexFromOffset(currentPosition);
          if (iChord != -1) {
            var $gotTheChord = $("#"+"chord"+iChord);
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
          }
        });
      });
      
    });

    /* chords offsets */
    $.each($("div.table#harmo > div > div > div > span"), function(index) {
        $(this).prop("id", "chord"+index);
        var range = getChordsOffsetFromIndex(index, 1);
        $(this).data("position", range.start);
        $(this).data("stop", range.stop);
    });

    // show that we are on first chord
    var $startChord = $('span#chord0');
    var alternateBackgroundColor = $startChord.parent().parent().data( 'data-bg-alt');
    $startChord.css( {'background-color': alternateBackgroundColor} );

    /* bars offsets */
    $.each($("div.table#harmo > div.numbers > div").not(".header"), function(index) {
        $(this).prop("id", "bar"+index);
        var range = getChordsOffsetFromIndex(index*4, 4);
        $(this).data("position", range.start);
        $(this).data("stop", range.stop);
    });

    /* parts offsets */
    $.each($(".header"), function(index) {
        $(this).prop("id", "part"+index);
        var range = getChordsOffsetFromIndex(index*4*12, 4*12);
        $(this).data("position", range.start);
        $(this).data("stop", range.stop);
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
        var range = getChordsOffsetFromIndex(start*4, (stop-start)*4);
        $(this).data("position", range.start);
        $(this).data("stop", range.stop);
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
          console.log("start", pos);
          if (typeof pos !== "undefined" && pos != null) {
            clickedID = $(this).attr('id');

            widget.pause();
            widget.seekTo(pos);
            widget.play();
            stop = $(this).data("stop");
            console.log("stop", stop);
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
