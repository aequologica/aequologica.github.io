var Measure = (function () {
    'use strict';

    const defaultType = "deaths";

    let type = defaultType;

    function getType() {
        return type;
    }

    function setType(newType) {
        if (newType && newType !== type) {
            switch (newType) {
                case "confirmed":
                case "deaths":
                case "recovered":
                    type = newType;
                    break;
                default:
                    type = defaultType;
                    break;
            }
            if (type === defaultType) {
                localStorage.removeItem("measureType");
                console.log("remove type from local storage:");
            } else if (newType !== type){
                localStorage.setItem("measureType", type);
                console.log("write type to local storage:", "\"" + type + "\"");
            }
        }
    }

    // read type from local storage 
    let typeFromLocalStorage = localStorage.getItem("measureType");
    if (typeFromLocalStorage) {
        setType(typeFromLocalStorage);
        console.log("read type from local storage:", "\"" + typeFromLocalStorage + "\"");
    } else {
        console.log("get type from factory:", "\"" + type + "\"");
    }

    return {
        func: (d) => d[type],
        getType: getType,
        setType: setType,
    }
});