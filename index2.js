(function (
    gridSelectorParam,
    itemSelectorParam,
    snitchSelectorParam,
    handlebarsTemplateSelectorParam
) {

    /*
    let inTheOffice        = false;
    */
    const handlebarsSource = $(handlebarsTemplateSelectorParam)[0].innerHTML;
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
        // Convert [0,1) to (0,1]
        // cf. last comment of https://stackoverflow.com/a/36481059/1070215
        u1 = 1 - rng();
        u2 = 1 - rng();
        const R = Math.sqrt(-2.0 * Math.log(u1));
        const Θ = 2.0 * Math.PI * u2;
        return [R * Math.cos(Θ), R * Math.sin(Θ)];
    };

    // (Unused now) skew-normal generator
    //  ξ: location (mean), ω: scale (standard deviation), α: shape (skewness)
    const randomSkewNormal = (rng, ξ, ω, α = 0) => {
        α = -α;
        const [u0, v] = randomNormals(rng);
        if (α === 0) {
            return ξ + ω * u0;
        }
        const 𝛿 = α / Math.sqrt(1 + α * α);
        const u1 = 𝛿 * u0 + Math.sqrt(1 - 𝛿 * 𝛿) * v;
        const z = u0 >= 0 ? u1 : -u1;
        return ξ + ω * z;
    };

    // ---- New functions for lognormal distribution ----

    // Returns a single normally distributed random value using the Box–Muller transform.
    function randomNormalSingle(rng) {
        return randomNormals(rng)[0];
    }

    // Returns a lognormally distributed random number.
    // arithmeticMean: desired arithmetic mean of the lognormal variable.
    // sigma: controls the variability (larger sigma → more spread and heavier tails).
    function randomLogNormal(rng, arithmeticMean, sigma) {
        // For a lognormal distribution, the arithmetic mean is:
        //   E[X] = exp(mu + sigma^2 / 2)
        // so, to achieve a target mean, we set:
        //   mu = ln(arithmeticMean) - sigma^2 / 2
        const mu = Math.log(arithmeticMean) - (sigma * sigma) / 2;
        return Math.exp(mu + sigma * randomNormalSingle(rng));
    }
    // ---- End new functions ----

    // ---- ASCII Scatter Plot Function ----
    // Plots an array of data points (each an [x, y] pair) as an ASCII scatter plot in the console.
    function asciiScatterPlot(data, options) {
        options = options || {};
        const gridWidth = options.width || 60;
        const gridHeight = options.height || 20;

        // Determine bounds for x and y:
        const xs = data.map(pt => pt[0]);
        const ys = data.map(pt => pt[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Create an empty grid.
        const grid = [];
        for (let i = 0; i < gridHeight; i++) {
            grid.push(new Array(gridWidth).fill(' '));
        }

        // Functions to scale x and y values to grid coordinates.
        function scaleX(x) {
            return Math.floor((x - minX) / (maxX - minX) * (gridWidth - 1));
        }
        function scaleY(y) {
            // Invert y so that higher values appear at the top.
            return Math.floor((maxY - y) / (maxY - minY) * (gridHeight - 1));
        }

        // Plot each point.
        data.forEach(pt => {
            const col = scaleX(pt[0]);
            const row = scaleY(pt[1]);
            grid[row][col] = 'o';
        });

        // Join the grid into a string.
        const plotStr = grid.map(row => row.join('')).join('\n');
        console.log(plotStr);
        console.log(`X: ${minX} to ${maxX}, Y: ${minY} to ${maxY}`);
    }
    // ---- End ASCII Scatter Plot Function ----

    // Existing parameters for sizing images:
    let multiple = 5000;
    let transparents = 10;
    if (window.matchMedia("(max-width: 992px)").matches) {
        transparents = 0;
        multiple = 3000;
    }
    // We'll store computed values in "surfaces" (now including width)
    let surfaces = [];

    function setRandomSurface(image) {
        // --- New implementation using lognormal distribution ---
        // Use these parameters to generate a "pick" value:
        // pickMean: target mean for the “pick” value.
        // pickSigma: control the variability.
        const pickMean = 2.4;
        const pickSigma = 1.1; // Increase for more extreme small/large values.
        let pick = randomLogNormal(Math.random, pickMean, pickSigma);
        // ---------------------------------------------------

        // Calculate surface area based on our random pick.
        let surface = multiple * pick;
        let width, height;
        if (Number.isFinite(surface) && image.width && image.height) {
            const ratio = Math.sqrt(surface / (image.width * image.height));
            width = Math.round(image.width * ratio);
            height = Math.round(image.height * ratio);
        } else {
            width = height = Math.round(Math.sqrt(surface));
        }
        if (Number.isFinite(width) && Number.isFinite(height)) {
            image.style = `width: ${width}px; height: auto;`;
            image.width = width;
            image.height = "auto";
        } else {
            // console.log(image.src)
        }
        // Save the computed surface, the "pick" value, and the width.
        if (typeof surfaces !== 'undefined') {
            surfaces.push({ surface: width * height, pick: pick, width: width });
        }

        // console.log(image.width, image.height, image.width * image.height, surface)
    }

    $(document).ready(function () {
        const $m = $(gridSelectorParam);

        if (typeof surfaces !== 'undefined') {
            surfaces.length = 0;
        }

        $("html, body, #grid").bind("click", function (event) {
            if (event.target.nodeName == "HTML" ||
                event.target.nodeName == "BODY" ||
                event.target.id.indexOf("grid") != -1) {

                var gridItems = document.querySelectorAll(itemSelectorParam);
                gridItems.forEach(function (item) {
                    var img = item.querySelector('img');
                    setRandomSurface(img);
                });
                $m.isotope('layout');
                $m.isotope('shuffle');
                event.preventDefault();
                event.stopPropagation();
            }
        });

        function loadData() {
            let configuration;

            $.ajax({
                type: "GET",
                dataType: "json",
                cache: false,
                url: "index2.json",
            }).done(function (data, textStatus, jqXHR) {
                configuration = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                configuration = {}
            }).always(function (data_jqXHR, textStatus, jqXHR_errorThrown) {
                try {
                    const bricks = [];

                    $m.isotope({
                        layoutMode: 'packery',
                        itemSelector: itemSelectorParam,
                        packery: {
                            gutter: 6,
                        }
                    });

                    _.forEach(configuration.images, function (ima, i) {
                        if (ima.src.startsWith("http") || ima.src.startsWith("/")) {
                            ima.ima = ima.src;
                        } else if (ima.src.startsWith("script:")) {
                            ima.ima = "images/asd.svg";
                            {
                                var script = document.createElement('script');
                                script.onload = function () {
                                    // console.log("SCRIPT LOADED!")
                                    let s = ima.src.split(':')[1].split('.')[0];
                                    console.log(eval(s)(ima.url, ima.file, ima.name));
                                };
                                script.src = ima.src.split(':')[1];
                                document.head.appendChild(script);
                            }
                        } else {
                            ima.ima = "images/" + ima.src;
                        }

                        bricks.push(ima);
                    });

                    for (let t = 0; t < transparents; t++) {
                        const tras = {};
                        tras.ima = "images/transparent.png";
                        tras.class = "transparent";
                        bricks.push(tras);
                    }

                    const shuffledBricks = shuffleArray(bricks);
                    const $bricksContainer = $("<div>");

                    _.forEach(shuffledBricks, function (brick) {
                        $bricksContainer.append($(handlebarsTemplate(brick)));
                    });

                    const $bricks = $bricksContainer.children();
                    $m.empty().append($bricks).isotope('appended', $bricks);

                    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                    $m.imagesLoaded().progress(function (instance, image) {
                        if (image.isLoaded) {
                            setRandomSurface(image.img);
                        }
                    }).always(function () {
                        $m.isotope('layout');
                        $("#gridContainer").css("visibility", "visible");

                        // Log surfaces to check the distribution:
                        if (typeof surfaces !== 'undefined' && surfaces.length) {
                            surfaces.sort(function (a, b) {
                                return a.surface - b.surface;
                            });
                            const [totalSurface, totalPick] = surfaces.reduce((a, b) => [
                                a[0] + b.surface,
                                a[1] + b.pick
                            ], [0, 0]);
                            const significantNumbers = [
                                surfaces[0],
                                { surface: Math.round(totalSurface / surfaces.length), pick: Math.round(totalPick / surfaces.length) },
                                surfaces[surfaces.length - 1],
                            ];
                            _.forEach(surfaces, function (s, i) {
                                console.log(s.surface, s.pick, s.width);
                            });
                            console.log('========');
                            _.forEach(significantNumbers, function (s, i) {
                                console.log(s.surface, s.pick, s.width);
                            });

                            // ---- Draw an ASCII scatter plot of widths ----
                            // We'll plot the index (x-axis) versus the computed width (y-axis).
                            const dataPoints = surfaces.map((s, i) => [i, s.width]);
                            asciiScatterPlot(dataPoints, { width: 80, height: 25 });
                            // ---- End ASCII scatter plot ----
                        }
                    });
                } catch (err) {
                    alert(err);
                }
            }); // always   
        } // function loadData

        $(snitchSelectorParam).imagesLoaded().always(function (instance) {
            loadData();
        });
    }); // document ready
}(
    "#grid",
    ".grid-brick",
    "#mouchard",
    "#brick-template"
)); // self-executing enclosing function
