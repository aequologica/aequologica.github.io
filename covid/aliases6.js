var Aliases = (() => {
    'use strict';

    const countryAliases = {
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
    
    const excludedNoPopulation = _.sortBy([
        "Burma",
        "Diamond Princess",
        "Kosovo",
        "MS Zaandam"
    ]);

    const excludedNoCovidData = _.sortBy([
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
    ]);
    
    const factory = _.sortBy([
        "Belgium",
        "Brazil",
        "France",
        "Germany",
        "Italy",
        "Russia",
        "South Korea",
        "Spain",
        "Sweden",
        "United Kingdom",
        "United States",
    ]);
    

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
        c2a: (c) =>
            countryAliases[c] || c
        ,
        a2c: (a) => {
            let key = findKeyHavingValue(countryAliases, a);
            if (key) {
                return key;
            }
            return a;
        },
        read: () => {
            var a = localStorage.getItem("aliases");
            if (a != null) {
                if (typeof a !== "string" || a.length == 0) {
                    a = [];
                } else {
                    a = a.split(',');
                    a = _.sortBy(a);    
                }
                console.log('read aliases from local storage', a);
            } else {
                a = _.cloneDeep(factory);
                console.log('get aliases from factory', a);
            }
            return a;
        },
        write: (a) => {
            a = _.sortBy(a);
            if (_.isEqual(a, this.factory)) {
                this.reset();
            } else {
                localStorage.setItem('aliases', a);
                console.log('write aliases to local storage', a);
            }
            
        },
        reset: () => {
            localStorage.removeItem('aliases');
            console.log('remove aliases from local storage');
        },
        isExcluded: (a) => {
            if (-1 !== _.sortedIndexOf(excludedNoPopulation, a)) {
                return true;
            }
            if (-1 !== _.sortedIndexOf(excludedNoCovidData, a)) {
                return true;
            } 
            return false;
        }
    }
})();
