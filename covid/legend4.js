var Legend = (function () {
    'use strict';

    // legend
    function draw(svg, populations, color, y, height) {

        var isPopulationColumnVisible = localStorage.getItem("togglePopulationColumnVisibility") == "visible";

        d3.selectAll("foreignObject").remove();
        var fo = svg.append("foreignObject")
            .attr("x", 5)
            .attr("y", y + 5)
            .attr("width", 280)
            .attr("height", height - 10)
            .attr("class", "")
            .attr("style", "overflow-y: scroll; direction:rtl;")
            .attr("id", "legend");
        var card = fo.append('xhtml:div');
        card.attr("class", "card");
        card.attr("style", "direction:ltr;");
        var cardbody = card.append('xhtml:div');
        cardbody.attr("class", "card-body");
        cardbody.attr("style", "");
        var t = cardbody.append('table');
        t.attr("id", "legend");
        t.attr("class", "");
        t.attr("style", "");
        var r = t.append('tr');
        // col 1
        r.append('th').attr("class", "remove").append('span').html("&nbsp;");
        // col 2
        {
            var th = r.append('th');
            th.attr("class", "country");
            {
                var add = th.append('button');
                add.attr("type", "button");
                add.attr("class", "add btn btn-sm btn-primary float-left");
                add.attr("title", "add country");
                add.attr("data-toggle", "modal");
                add.attr("data-target", "#exampleModal");
                add.append('i').attr("class", "fas fa-plus");
            }
            th.append('span').html("&nbsp;");
            {

                var hide = th.append('button');
                hide.attr("type", "button");
                hide.attr("class", "hide btn btn-sm btn-outline-secondary float-right");
                hide.attr("title", "toggle population column visibility");
                hide.append('i').attr("class", "fas fa-globe");
     
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
            var alias = Aliases.c2a(c);
            var del = r.append('td').attr("class", "remove").append('button');
            del.attr("type", "button");
            del.attr("class", "remove btn btn-sm btn-outline-secondary");
            del.attr("title", "remove " + alias);
            del.attr("name", alias);
            del.append('span').attr("class", "remove").html("&times;");
            // col 2
            var td = r.append('td');
            td.attr("class", "country");
            td.attr("style", "color:" + color(c)).html(c);
            // col 3
            var po = r.append('td').attr("class", "population");
            if (!isPopulationColumnVisible) {
                po.attr("style", "display:none");
            }
            po.html(new Intl.NumberFormat().format(populations[c]));
        }

        var buttons = document.querySelectorAll('[type="button"].remove');
        buttons.forEach(function (b) {
            b.addEventListener("click", function (event) {
                var locallyStoredAliases = Aliases.read();
                const index = locallyStoredAliases.indexOf(event.currentTarget.name);
                if (index > -1) {
                    locallyStoredAliases.splice(index, 1);
                }
                Aliases.write(locallyStoredAliases);
                location.reload();
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
    }

    return {
        draw: function (svg, populations, color, y, height) {
            draw(svg, populations, color, y, height);
        },
    }
})();
