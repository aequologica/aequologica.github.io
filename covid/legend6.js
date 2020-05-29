var Legend = (function () {
    'use strict';

    // legend
    return {
        draw: (svg, populations, color, y, height, handlebarsTemplate) => {

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

            Handlebars.registerHelper("alias", (country) => Aliases.c2a(country) );
            Handlebars.registerHelper("color", (country) => color(country) );

            fo.append('xhtml:div').html(handlebarsTemplate({
                populations: populations,
                isPopulationColumnVisible: isPopulationColumnVisible,
            }));
            
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
