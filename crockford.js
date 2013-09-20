"use strict";

/**
  Function.method - Hilfsmethode um ein Objekt sauber um eine Methode zu erweitern( (Augmentation).
**/

Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};