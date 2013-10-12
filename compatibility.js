/*jslint browser:true */

"use strict";

/**
  window.requestAnimateionFrame - Kompatibilitätsmethode um sicher das Animation Frame beim Browser zu beantragen (inkl. Fallback)
**/

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

/**
  window.URL - Kompatibilitätseigenschaft zum Zugriff auf die URL des Fensters.
**/

window.URL =
    window.URL || window.webkitURL || window.mozURL || window.msURL;


/**
  navigator.getUserMedia - Kompatibilitätsmethode zum Zugriff auf die WebRTC Schnittstelle aller Browserimplementierungen.
**/
navigator.getUserMedia  =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;




