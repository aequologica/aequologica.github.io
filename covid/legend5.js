var Legend = (function () {
    'use strict';

    // legend
    return {
        draw: (svg, populations, color, y, height) => {

            const isPopulationColumnVisible = localStorage.getItem("togglePopulationColumnVisibility") == "visible";

            d3.selectAll("foreignObject").remove();
            const fo = svg.append("foreignObject")
                .attr("x", 5)
                .attr("y", y + 5)
                .attr("width", 280)
                .attr("height", height - 10)
                .attr("class", "")
                .attr("style", "overflow-y: scroll; direction:rtl;")
                .attr("id", "legend");
            const card = fo.append('xhtml:div');
            card.attr("class", "card");
            card.attr("style", "direction:ltr;");
            const cardbody = card.append('xhtml:div');
            cardbody.attr("class", "card-body");
            cardbody.attr("style", "");
            const t = cardbody.append('table');
            t.attr("id", "legend");
            t.attr("class", "");
            t.attr("style", "");
            const headerRow = t.append('tr');
            // col 1 
            {
                const remo = headerRow.append('th');
                remo.attr("class", "remove")
                    .append('span')
                    .html("&nbsp;");
            }
            // col 2
            {
                const th = headerRow.append('th');
                th.attr("class", "country");
                {
                    const add = th.append('button');
                    add.attr("type", "button");
                    add.attr("class", "add btn btn-sm btn-primary float-left");
                    add.attr("title", "add country");
                    add.attr("data-toggle", "modal");
                    add.attr("data-target", "#exampleModal");
                    add.append('i').attr("class", "fas fa-plus");
                }
                th.append('span').html("&nbsp;");
                {
                    const hide = th.append('button');
                    hide.attr("type", "button");
                    hide.attr("id", "populationToggle");
                    hide.attr("class", "btn btn-sm btn-outline-secondary float-right");
                    hide.attr("title", "toggle population column visibility");
                    hide.append('i').attr("class", "fas fa-globe");
                }
            }
            // col 3
            {
                const pop = headerRow.append('th').attr("class", "population");
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
                const row = t.append('tr');

                // col 1
                const alias = Aliases.c2a(c);
                const del = row.append('td').attr("class", "remove").append('button');
                del.attr("type", "button");
                del.attr("class", "remove btn btn-sm btn-outline-secondary");
                del.attr("title", "remove " + alias);
                del.attr("name", alias);
                del.append('span').attr("class", "remove").html("&times;");
                // col 2
                const td = row.append('td');
                td.attr("class", "country");
                td.attr("style", "color:" + color(c)).html(c);
                // col 3
                const pop = row.append('td').attr("class", "population");
                if (!isPopulationColumnVisible) {
                    pop.attr("style", "display:none");
                }
                pop.html(new Intl.NumberFormat().format(populations[c]));
            }

            const removeButtons = document.querySelectorAll('[type="button"].remove');
            removeButtons.forEach((b) => {
                b.addEventListener("click", (event) => {
                    const locallyStoredAliases = Aliases.read();
                    const index = locallyStoredAliases.indexOf(event.currentTarget.name);
                    if (index > -1) {
                        locallyStoredAliases.splice(index, 1);
                    }
                    Aliases.write(locallyStoredAliases);
                    location.reload();
                })
            });
            const populationToggleButtons = document.querySelectorAll('[type="button"]#populationToggle');
            populationToggleButtons.forEach((b) => {
                b.addEventListener("click", () => {
                    const pops = document.getElementsByClassName("population");
                    for (let pop of pops) {
                        const sty = pop.getAttribute("style");
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
    }
})();
