(function (
    gridSelectorParam, 
    itemSelectorParam,
    snitchSelectorParam,
    handlebarsTemplateSelectorParam
    ) {
    
    /*
    let inTheOffice        = false;
    */
    const handlebarsSource   = $(handlebarsTemplateSelectorParam)[0].innerHTML;
    const handlebarsTemplate = Handlebars.compile(handlebarsSource);
    
    
    // http://stackoverflow.com/questions/20789373/shuffle-array-in-ng-repeat-angular
    // -> Fisher–Yates shuffle algorithm
    function shuffleArray(array) {
        let m = array.length, t, i;
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

    // https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
    const randomNormals = (rng) => {
        let u1 = 0, u2 = 0;
        //Convert [0,1) to (0,1)
        // cf. last comment of https://stackoverflow.com/a/36481059/1070215
        u1 = 1 - rng();
        u2 = 1 - rng();
        const R = Math.sqrt(-2.0 * Math.log(u1));
        const Θ = 2.0 * Math.PI * u2;
        return [R * Math.cos(Θ), R * Math.sin(Θ)];
    };
    //  ξ: location (mean), ω: scale (standard deviation), α: and shape (skewness)
    const randomSkewNormal = (rng, ξ, ω, α = 0) => {
        α = -α
        const [u0, v] = randomNormals(rng);
        if (α === 0) {
            return ξ + ω * u0;
        }
        const 𝛿 = α / Math.sqrt(1 + α * α);
        const u1 = 𝛿 * u0 + Math.sqrt(1 - 𝛿 * 𝛿) * v;
        const z = u0 >= 0 ? u1 : -u1;
        return ξ + ω * z;
    };    

    let surfaces = []; // uncomment variable surfaces to check normal distribution on console (see below)
    function setRandomSurface(image) {

        // const surface = Math.floor(randn_bm(0, 24000, 1));
        const location = 2        
        const scale = 1
        const shape = 0
        const multiple = 5000
        const pick = randomSkewNormal(Math.random, location, scale, shape)
        // console.log(pick)
        let surface = 0.1 < pick ? multiple * pick : multiple * location
        let width, height
        if (!isNaN(surface) && image.width && image.height) {
            const ratio = Math.sqrt(surface / (image.width * image.height))

            width = Math.round(image.width * ratio)
            height = Math.round(image.height * ratio)
        } else {
            width = height = Math.round(Math.sqrt(surface))
        }
        if (!isNaN(width) && !isNaN(height)) {
            image.style = `width: ${width}px; height: auto;`
            image.width = width
            image.height = "auto";
        } else {
            console.log(image.src)
        }
        if (typeof surfaces !== 'undefined') { 
            surfaces.push({surface:width * height, pick:pick});
        }

        // console.log(image.width, image.height, image.width * image.height, surface)
    }

    $( document ).ready(function() {

        const $m = $(gridSelectorParam);

        if (typeof surfaces !== 'undefined') {
            surfaces.length = 0;
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
            let configuration;

            $.ajax({
                type        : "GET",
                dataType    : "json",
                cache       : false,
                url         : "index2.json",
            }).done(function(data, textStatus, jqXHR) {
                configuration = data;
            }).fail(function(jqXHR, textStatus, errorThrown) {
                configuration = {}
            }).always(function(data_jqXHR, textStatus, jqXHR_errorThrown) {
                try {                
                    const bricks = [];

                    $m.isotope({
                        layoutMode   : 'packery',
                        itemSelector : itemSelectorParam,
                        packery      : {
                            gutter: 6,
                        }              
                    });

                    _.forEach(configuration.images, function(ima, i) {
                        if (ima.src.startsWith("http") || ima.src.startsWith("/")) {
                          ima.ima = ima.src;
                        } else {
                          ima.ima = "images/"+ima.src;
                        }
            
                        bricks.push(ima);
                    });
                    
                    for (let transparents = 0; transparents<8; transparents++) {
                        const tras = {}
                        tras.ima = "images/transparent.png";
                        tras.class= "transparent"
                        bricks.push(tras);
                    }

                    const shuffledBricks = shuffleArray(bricks);

                    const $bricksContainer = $("<div>");
                        
                    _.forEach(shuffledBricks, function(brick) {
                        $bricksContainer.append($(handlebarsTemplate(brick)));
                    });

                    const $bricks = $bricksContainer.children();
                    
                    $m.empty().append( $bricks ).isotope( 'appended', $bricks );

                    $m.imagesLoaded().progress( function( instance, image ) {
                        if (image.isLoaded) {
                            setRandomSurface(image.img)
                        }
                    }).always( function() {
                        $m.isotope('layout');
                        $("#gridContainer").css("visibility", "visible");
                        // display random surfaces to vaguely check normal distribution on console
                        if (typeof surfaces !== 'undefined' || surfaces.length) {
                            surfaces.sort(function(a, b) {
                                return a.surface - b.surface;
                            });
                            const [totalSurface, totalPick] = surfaces.reduce((a, b) => [
                                    a[0] + b.surface, 
                                    a[1] + b.pick
                                ]
                            , [0,0])
                            const significantNumbers = [
                                surfaces[0],
                                {surface: Math.round(totalSurface/surfaces.length), pick : Math.round(totalPick/surfaces.length)}, 
                                surfaces[surfaces.length - 1],
                            ]
                            _.forEach(surfaces, function(s, i) {
                                console.log(s.surface, s.pick);
                            });
                            console.log('========')
                            _.forEach(significantNumbers, function(s, i) {
                                console.log(s.surface, s.pick);
                            });
                        }


                    });
                } catch(err) {
                    alert(err);
                }
            });// always   
        } // function loadData

        $(snitchSelectorParam).imagesLoaded().always(function( instance ) {
            loadData();
        })
    }); // document ready
}(
  "#grid",
  ".grid-brick",
  "#mouchard",
  "#brick-template"
)); // self-exeuting enclosing function

