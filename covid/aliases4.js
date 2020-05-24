var Aliases = (function () {
    'use strict';

    var countryAliases = {
        "Congo (Brazzaville)": "Congo",
        "Congo (Kinshasa)": "DR Congo",
        "Cote d'Ivoire": "Côte d'Ivoire",
        "Czechia": "Czech Republic (Czechia)",
        "Guinea-Bissau": "Guinea-Bissau",
        "Guinea": "Equatorial Guinea",
        "Korea, South": "South Korea",
        "Saint Kitts and Nevis": "Saint Kitts & Nevis",
        "Saint Vincent and the Grenadines": "St. Vincent & Grenadines",
        "Sao Tome and Principe": "Sao Tome & Principe",
        "Taiwan*": "Taiwan",
        "US": "United States",
        "West Bank and Gaza": "State of Palestine",
    };
    var excludedNoPopulation = [
        "Burma",
        "Diamond Princess",
        "Kosovo",
        "MS Zaandam"
    ];
    var excludedNoCovidData = [
        "American Samoa",
        "Anguilla",
        "Aruba",
        "Bermuda",
        "British Virgin Islands",
        "Caribbean Netherlands",
        "Cayman Islands",
        "Channel Islands",
        "Comoros",
        "Cook Islands",
        "Curaçao",
        "Faeroe Islands",
        "Falkland Islands",
        "French Guiana",
        "French Polynesia",
        "Gibraltar",
        "Greenland",
        "Guadeloupe",
        "Guam",
        "Hong Kong",
        "Isle of Man",
        "Kiribati",
        "Lesotho",
        "Macao",
        "Marshall Islands",
        "Martinique",
        "Mayotte",
        "Micronesia",
        "Montserrat",
        "Myanmar",
        "Nauru",
        "New Caledonia",
        "Niue",
        "North Korea",
        "Northern Mariana Islands",
        "Palau",
        "Puerto Rico",
        "Réunion",
        "Saint Barthelemy",
        "Saint Helena",
        "Saint Martin",
        "Saint Pierre & Miquelon",
        "Samoa",
        "Sint Maarten",
        "Solomon Islands",
        "Tajikistan",
        "Tokelau",
        "Tonga",
        "Turkmenistan",
        "Turks and Caicos",
        "Tuvalu",
        "U.S. Virgin Islands",
        "Vanuatu",
        "Wallis & Futuna",
    ];

    var factory = [
        "Belgium",
        "Brazil",
        "France",
        "Germany",
        "Italy",
        /*"Netherlands",*/
        /*"Portugal",*/
        /*"Russia",*/
        "South Korea",
        "Spain",
        "Sweden",
        /*"Switzerland",*/
        "United Kingdom",
        "United States",
    ];

    function findKey(object, keyParam) {
        for (let key in object) {
            if (keyParam == key) {
                return key;
            };
        };
        return undefined;
    }
    function findKeyHavingValue(object, value) {
        for (let key in object) {
            if (value == object[key]) {
                return key;
            };
        };
        return undefined;
    }
    return {
        factory: factory,
        c2a: function (c) {
            return countryAliases[c] || c;
        },
        a2c: function (a) {
            var key = findKeyHavingValue(countryAliases, a);
            if (key) {
                return key;
            }
            return a;
        },
        read: function () {
            var a = localStorage.getItem("aliases");
            if (a != null) {
                if (a.length == 0) {
                    a = [];
                } else {
                    a = a.split(',');
                }
            } else {
                a = factory;
                this.write(a);
            }
            a = _.sortBy(a);
            console.log('read', a);
            return a;
        },
        write: function (a) {
            a = _.sortBy(a);
            localStorage.setItem('aliases', a);
            console.log('write', a);
        },
        reset: function () {
            localStorage.removeItem('aliases');
        },
        isExcluded: function (a) {
            if (excludedNoPopulation.includes(a)) {
                return true;
            }
            if (excludedNoCovidData.includes(a)) {
                return true;
            } 
            return false;
        }
    }
})();
