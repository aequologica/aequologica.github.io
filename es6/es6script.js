// Just for example...
"use strict";

class Car { // yay!
   constructor(speed) {
       this.speed = speed;
   }
}

var foo = Symbol('foo'); // wohoo!
var bar = new Car(320);  // blaze it!
var baz = (name) => { 
    document.getElementById("title").firstChild.textContent = 'Hello ' + name + '!'; 
}; // so cool!

baz("es6");