(function (
    gridSelectorParam, 
    itemSelectorParam,
    snitchSelectorParam,
    handlebarsTemplateSelectorParam
    ) {
    
    var inTheOffice        = false;
    var handlebarsSource   = $(handlebarsTemplateSelectorParam)[0].innerHTML;
    var handlebarsTemplate = Handlebars.compile(handlebarsSource);

    // http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
    // -> Fisher–Yates shuffle algorithm
    function shuffleArray(array) {
        var m = array.length, t, i;
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

    // https://stackoverflow.com/a/49434653/1070215
    // -> Box–Muller transform
    function randn_bm(min, max, skew) {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        var num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
        return num;
    }

    // var widths = []; // uncomment variable widths to check normal distribution on console (see below)
    function getRandomWidth() {
        var width = Math.floor(randn_bm(10, 210, 1));
        if (typeof widths !== 'undefined') { 
            widths.push(width);
        }
        return width;
    }

    $( document ).ready(function() {

        var $m = $(gridSelectorParam);

        if (typeof widths !== 'undefined') {
            widths.length = 0;
        }

        $("html, body, #grid").bind( "click", function( event ) {
            if (event.target.nodeName == "HTML" || 
                event.target.nodeName == "BODY" || 
                event.target.id.indexOf("grid") != -1) {
                $m.isotope('shuffle');
                event.preventDefault();
                event.stopPropagation();
            }
        });

        function loadData() {
            var loaded = {};

            $.ajax({
                type        : "GET",
                dataType    : "json",
                cache       : false,
                url         : "index.json",
            }).done(function(data, textStatus, jqXHR) {
                loaded = data;
            }).fail(function(jqXHR, textStatus, errorThrown) {
            }).always(function(data_jqXHR, textStatus, jqXHR_errorThrown) {
                try {                
                    var bricks = [];

                    $m.isotope({
                        layoutMode   : 'packery',
                        itemSelector : itemSelectorParam,
                        packery      : {
                            gutter: 6,
                        }              
                    });

                    _.forEach(loaded.images, function(ima, i) {
                        if (ima.src.startsWith("http")) {
                          ima.ima = ima.src;
                        } else {
                          ima.ima = "images/"+ima.src;
                        }
            
                        if (!ima.width) {
                            ima.width = getRandomWidth();
                            ima.height = "auto";
                        } 
                        bricks.push(ima);
                    });

                    // display random widths to vaguely check normal distribution on console
                    if (typeof widths !== 'undefined') {
                        widths.sort(function(a, b) {
                            return a - b;
                        });
                        _.forEach(widths, function(tick, i) {
                            console.log(Math.floor(tick/10));
                        });
                    }

                    if (!inTheOffice) {
                        bricks = _.filter(bricks, function(ima) { 
                            return ima.url.indexOf("sap.corp")==-1; 
                        });
                    }

                    bricks = shuffleArray(bricks);

                    var $bricksContainer = $("<div>");
                        
                    _.forEach(bricks, function(brick) {
                        $bricksContainer.append($(handlebarsTemplate(brick)));
                    });

                    var $bricks = $bricksContainer.children();
                    
                    $m.empty().append( $bricks ).isotope( 'appended', $bricks ).isotope('layout');

                    $m.imagesLoaded().progress( function( instance, image ) {
                        if (!image.isLoaded) {
                            // console.log( 'image is broken for', image.img.src);
                        }
                        // $m.isotope('layout');
                    }).always( function() {
                        $m.isotope('layout');
                        $(".grid-brick img").css("visibility", "visible");
                    });
                } catch(err) {
                    alert(err);
                }
            });// always   
        } // function loadData

        $(snitchSelectorParam).imagesLoaded().always(function( instance ) {
            // console.log('all images successfully loaded');
            loadData();
        }).done( function( instance ) {
            // console.log('all images successfully loaded');
        }).fail( function() {
            // console.log('all images loaded, at least one is broken');
        }).progress( function( instance, image ) {
            if (!image.isLoaded) {
                // console.log( 'image is BROKEN for', image.img.src );
                inTheOffice = false;
                $(instance).find("img").hide();
            } else {
                // console.log( 'image is OK for', image.img.src);
                inTheOffice = (image.img.src.indexOf("sap.corp") != -1);
                $(instance).find("img").show();
            }
            // console.log( 'out of office', !inTheOffice);
        }); // wait for snitch image to be loaded
    }); // document ready
}(
  "#grid",
  ".grid-brick",
  "#mouchard",
  "#brick-template"
)); // self-exeuting enclosing function

