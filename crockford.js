/**
  crockford.js - Helper Libary, inspired from the golden book of JavaScript development "JavaScript: The Good Parts" by Douglas Crockford
**/

"use strict";

/**
  Function.method - Helper method to augment any object with a new method if it don't exists.
  Function is the main object, thus we define this helper here.

  Example:

  String.method("capitalize", function() { return this.charAt(0).toUpperCase() + this.substring(1); })
  "book".capitalize => "Book"

  @param name - the name of the new function (call it with anObject.name (args) )
  @param func - the function body as an closure
**/
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};