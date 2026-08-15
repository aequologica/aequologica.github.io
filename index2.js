const gridSelector = "#grid";
const itemSelector = ".grid-brick";
const snitchSelector = "#mouchard";
const handlebarsTemplateSelector = "#brick-template";
const DEBUG = false;

const handlebarsSource = document.querySelector(handlebarsTemplateSelector).innerHTML;
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
    }
    // Save the computed surface, the "pick" value, and the width.
    surfaces.push({ surface: width * height, pick: pick, width: width });
}

const gridEl = document.querySelector(gridSelector);
let iso;

surfaces.length = 0;

document.addEventListener("click", function (event) {
    if (event.target.nodeName == "HTML" ||
        event.target.nodeName == "BODY" ||
        event.target.id.indexOf("grid") != -1) {

        var gridItems = document.querySelectorAll(itemSelector);
        gridItems.forEach(function (item) {
            var img = item.querySelector('img');
            setRandomSurface(img);
        });
        if (iso) {
            iso.layout();
            iso.shuffle();
        }
        event.preventDefault();
        event.stopPropagation();
    }
});

function loadData() {
    fetch("index2.json", { cache: "no-store" })
        .then(function (res) { return res.json(); })
        .catch(function () { return {}; })
        .then(function (configuration) {
            try {
                const bricks = [];

                iso = new Isotope(gridEl, {
                    layoutMode: 'packery',
                    itemSelector: itemSelector,
                    packery: {
                        gutter: 6,
                    }
                });

                _.forEach(configuration.images, function (ima, i) {
                    if (ima.src.startsWith("http") || ima.src.startsWith("/")) {
                        ima.ima = ima.src;
                    } else if (ima.src.startsWith("script:")) {
                        ima.ima = "images/asd.svg";
                        import("./" + ima.src.split(':')[1]).then(function (mod) {
                            console.log(mod.default(ima.url, ima.file, ima.name));
                        });
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
                const bricksContainer = document.createElement("div");

                _.forEach(shuffledBricks, function (brick) {
                    bricksContainer.insertAdjacentHTML("beforeend", handlebarsTemplate(brick));
                });

                const newBricks = Array.from(bricksContainer.children);
                gridEl.innerHTML = "";
                newBricks.forEach(function (brick) { gridEl.appendChild(brick); });
                iso.appended(newBricks);

                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                const imgLoad = imagesLoaded(gridEl);
                imgLoad.on("progress", function (instance, image) {
                    if (image.isLoaded) {
                        setRandomSurface(image.img);
                    }
                });
                imgLoad.on("always", function () {
                    iso.layout();
                    document.querySelector("#gridContainer").style.visibility = "visible";

                    // Log surfaces to check the distribution:
                    if (DEBUG && surfaces.length) {
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
                console.error(err);
            }
        });
} // function loadData

imagesLoaded(snitchSelector).on("always", function () {
    loadData();
});
