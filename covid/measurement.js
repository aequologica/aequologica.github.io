var Measure = (function () {
    'use strict';

    /* type is one of
        confirmed
        deaths
        recovered
        active
    */ 
    
    // defaults
    var type = "deaths"; 
    var calc = function (d) { return +d.deaths };
    
    function getType() {
        return type;
    }

    function setType(newType) {
        switch (newType) {
            case "confirmed":
            case "deaths":
            case "recovered":
                type = newType;
                calc = function (d) { return +d[type] };
                localStorage.setItem("measureType", type);
                break;
            case "active":
                type = newType;
                calc = function (d) { return (+d.confirmed) - (+d.deaths) - (+d.recovered) };
                localStorage.setItem("measureType", type);
                break;
            default:
                type = "deaths";
                calc = function (d) { return +d.deaths };
                localStorage.setItem("measureType", type);
                break;
        }
    }

    // read type from storage
    setType(localStorage.getItem("measureType"));

    return {
        func: calc,
        getType: getType,
        setType: setType,
    }
});