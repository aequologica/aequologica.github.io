var Legend = (function () {
    'use strict';

     // legend
    function draw(svg, populations, color) {

        var isPopulationColumnVisible= localStorage.getItem("togglePopulationColumnVisibility") == "visible";

        var fo = svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 280)
            .attr("height", 280);
        var div = fo.append('xhtml:div');
        div.attr("class", "p-2");
        div.attr("style", "overflow-y: scroll");
        var t = div.append('table');
        t.attr("class", "table-responsive");
        var r = t.append('tr');
        // col 1
        r.append('th').append('span').html("&nbsp;");
        // col 2
        {
            var th = r.append('th');
            {
                var add = th.append('button');
                add.attr("type", "button");
                add.attr("class", "add btn btn-sm btn-outline-secondary");
                add.attr("title", "add country");
                add.attr("data-toggle", "modal");
                add.attr("data-target", "#exampleModal");
                add.append('span').html("+");
            }
            th.append('span').html("&nbsp;");
            {

                var hide = th.append('button');
                hide.attr("type", "button");
                hide.attr("class", "hide btn btn-sm btn-outline-secondary float-right");
                hide.attr("title", "toggle population column visibility");
                hide.append('span').html("&harr;");
            }
        }
        // col 3
        {
            var pop = r.append('th').attr("class", "population");
            if (!isPopulationColumnVisible) {
                pop.attr("style", "display:none");
            }
            if (populations.length == 0) {
                pop.html("&nbsp;");
            } else {
                pop.html("<a style='color: black !important' target ='_population-by-country' href='https://www.worldometers.info/world-population/population-by-country/'>population</a>");
            }
        }

        // rows
        for (let c in populations) {
            var r = t.append('tr');
            // col 1
            var del = r.append('td').append('button');
            del.attr("type", "button");
            del.attr("class", "remove btn btn-sm");
            var a = Aliases.c2a(c);
            del.attr("title", "remove " + a);
            del.attr("name", a);
            del.append('span').html("&times;");
            // col 2
            r.append('td').attr("style", "color:" + color(c)).html(c);
            // col 3
            var po = r.append('td').attr("class", "population");
            if (!isPopulationColumnVisible) {
                po.attr("style", "display:none");
            }
            po.html(new Intl.NumberFormat().format(populations[c]));
        }

        // last empty row (what the fuck?)
        {
            var r = t.append('tr');
            r.append('td').html("&nbsp;");
            r.append('td').html("&nbsp;");
            r.append('td').html("&nbsp;");
        }

        var buttons = document.querySelectorAll('[type="button"].remove');
        buttons.forEach(function (b) {
            b.addEventListener("click", function (event) {
                console.log(this);
                var locallyStoredAliases = Aliases.read();
                const index = locallyStoredAliases.indexOf(event.currentTarget.name);
                if (index > -1) {
                    locallyStoredAliases.splice(index, 1);
                }
                Aliases.write(locallyStoredAliases);
                location.reload();
            })
        });
        /*
        var buttons = document.querySelectorAll('[type="button"].add');
        buttons.forEach(function (b) {
            b.addEventListener("click", function () {
                window.open('settings.html', 'settings');
            })
        });
        */
        var buttons = document.querySelectorAll('[type="button"].save');
        buttons.forEach(function (b) {
            b.addEventListener("click", function () {
                alert("work in progress");
            })
        });
        var buttons = document.querySelectorAll('[type="button"].hide');
        buttons.forEach(function (b) {
            b.addEventListener("click", function () {
                var pops = document.getElementsByClassName("population");
                for (let pop of pops) {
                    var sty = pop.getAttribute("style");
                    if (!sty || sty == "display:table-cell") {
                        localStorage.setItem("togglePopulationColumnVisibility", "hidden");
                        pop.setAttribute("style", "display:none");
                    } else {
                        localStorage.setItem("togglePopulationColumnVisibility", "visible");
                        pop.setAttribute("style", "display:table-cell");
                    }
                    
                }
            })
        });
        var buttons = document.querySelectorAll('[type="button"].reset');
        buttons.forEach(function (b) {
            b.addEventListener("click", function () {
                Aliases.reset();
                reload();
            })
        });

        function reload() {
            location.reload();
        }
    }

    return {
        draw: function (svg, populations, color) {
            draw(svg, populations, color);
        },
    }
})();
