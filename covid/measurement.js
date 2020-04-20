var Measure = (function (param) {
    'use strict';
    
    /* type is
    confirmed
    deaths
    recovered
    active
    */

    var settings = {
        type    : param.type || "deaths",
    }

    var func;
    switch (settings.type) {
        case "confirmed":
        case "deaths":
        case "recovered":
            func = function (d) { return +d[settings.type] };
            break;
        case "active":
            func = function (d) { return (+d.confirmed) - (+d.deaths) - (+d.recovered) };
            break;
        default:
            func = function (d) { return +d.deaths };
    }

    return {
        func : func,
        type : settings.type,
        average: settings.average,
        sizeOfAverage: settings.sizeOfAverage,
    }
});