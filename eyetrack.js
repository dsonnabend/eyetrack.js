
"use strict";

/*jslint browser:true */
/*jslint plusplus: true */
/*global CanvasRenderingContext2D:false */

/* Modul Eyetrack */
var Eyetrack = function () {

        /* Variablen deklarieren */
        var date,
            starKernel,
            discKernel,
            video,
            cvFirst,
            cvSecond,
            cvThird,
            ctxFirst,
            ctxSecond,
            ctxThird,
            video_constraints,
            stream,
            idFirst,
            idSecond,
            that,
            connect_objects;

        /* Variablen initialiseren */
        that = this;
        date = new Date();
        starKernel = [ [ 0, 1, 0], [ 1, 1, 1], [ 0, 1, 0] ];
        discKernel = [ [ -1, 0, -1], [ -1, 0, -1], [ -1, 0, -1] ];
        video = document.querySelector('video');

        cvFirst = document.querySelector('.cvFirst');
        cvSecond = document.querySelector('.cvSecond');
        cvThird = document.querySelector('.cvThird');

        ctxFirst = cvFirst.getContext('2d');
        ctxSecond = cvSecond.getContext('2d');
        ctxThird  = cvThird.getContext('2d');

        video_constraints = {
            mandatory: {
                maxHeight: 640,
                maxWidth: 480
            },
            optional: []
        };

        stream = null;
        idFirst = null;
        idSecond = null;

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

        CanvasRenderingContext2D.prototype.erode = function (B) {

            var A_ImageData,
                data,
                width,
                height,
                y1_width,
                y2_width,
                y3_width,
                index,
                x,
                y;

            A_ImageData = this.getImageData(0, 0, 640, 480);

            data  = A_ImageData.data;
            width   = A_ImageData.width;
            height  = A_ImageData.height;

            for (x = 1; x < width; ++x) {
                for (y = 1; y < height; ++y) {

                    y1_width = (y - 1) * width;
                    y2_width = y * width;
                    y3_width = (y + 1) * width;

                    index = (y * width + x) * 4;

                    data[(x  + y2_width) * 4] =
                        data[(x - 1 + y1_width) * 4] * B[0][0] +
                        data[(x - 1 + y2_width) * 4] * B[0][1] +
                        data[(x - 1 + y3_width) * 4] * B[0][2] +

                        data[(x   + y1_width) * 4] *  B[1][0] +
                        data[(x   + y2_width) * 4] *  B[1][1] +
                        data[(x   + y3_width) * 4] *  B[1][2] +

                        data[(x + 1 + y1_width) * 4] * B[2][0] +
                        data[(x + 1 + y2_width) * 4] * B[2][1] +
                        data[(x + 1 + y3_width) * 4] * B[2][2];
                }
            }
        };


        CanvasRenderingContext2D.prototype.treshold = function (B) {

            var A_ImageData, B_ImageData, height, width, output, ubound, i, output_data, aimage_data, bimage_data;

            A_ImageData = this.getImageData(0, 0, 640, 480);
            B_ImageData = B.getImageData(0, 0, 640, 480);


            height = A_ImageData.height;
            width  = A_ImageData.width;

/*            width = 640;
            height = 320;*/

            output = this.canvas.getContext('2d').createImageData(width, height);
            ubound = width * height * 4;

            output_data = output.data;
            aimage_data = A_ImageData.data;
            bimage_data = B_ImageData.data;

            /* Subtract images, discard alpha channel (modulo 4 Operation). */
            for (i = 0; i < ubound; i++) {

                if (i % 4 < 3) {
                  output_data[i] = (aimage_data[i] - bimage_data[i]) > 30 ? 255 : 0;
                } else {
                    output_data[i] = aimage_data[i];
                }
            }

            return output;
        };

        // CanvasRenderingContext2D.prototype.treshold = function (B) {
        //     var width, height, x, y, adata, bdata;

        //     width = 640;
        //     height = 480;

        //     for (x = 0; x < width; x++) {
        //         for (y = 0; y < height; y++) {
        //             adata = this.getImageData(x, y, 1, 1).data;
        //             //bdata = B.getImageData(x, y, 1, 1).data;

        //             // adata[0] = (adata[0] - bdata[0]) > 30 ? 255 : 0;
        //             // adata[1] = (adata[1] - bdata[1]) > 30 ? 255 : 0;
        //             // adata[2] = (adata[2] - bdata[2]) > 30 ? 255 : 0;

        //             // this.putImageData(adata, x, y);
        //         }
        //     }

        // };


        /* Findet Objekte (Augen) im Bild */
        connect_objects = function (ctx) {
            var image_data = ctx.getImageData(0, 0, 640, 480);

        };


        return {

            initialize : function () {
                window.URL        =
                    window.URL ||
                    window.webkitURL;

                navigator.getUserMedia  =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        video : video_constraints
                    }, function (videoStream) {
                        video.src = window.URL.createObjectURL(videoStream);
                        stream = videoStream;
                    });
                } else {
                    video.src = 'somevideo.webm';
                }

            },

            snapshot :  function () {
                var img_data;
                if (stream) {

                    if (idFirst === false) {
                        ctxFirst.drawImage(video, 0, 0, 640, 480);
                        idFirst = true;
                    } else {
                        if (idSecond === false) {
                            ctxSecond.drawImage(video, 0, 0, 640, 480);
                            idSecond = true;
                            //img_data = ctxFirst.treshold(ctxSecond);
                            ctxFirst.treshold(ctxSecond);
                            //ctxThird.putImageData(img_data, 0, 0, 0, 0, 640, 480);
                            // ctxThird.drawImage(ctxFirst.treshold(ctxSecond),0,0,video_constraints.mandatory.maxWidth,video_constraints.mandatory.maxHeight);

                            // Open morphological operation (with a star-shaped kernel)
                            ctxThird.erode(starKernel);

                            connect_objects(ctxThird);

                        } else {
                            idFirst  = false;
                            idSecond = false;
                        }
                    }
                }
            }
        };
    }();

/* Eyetrack initialisieren */
Eyetrack.initialize();

var v = document.querySelector('video');

(function animloop() {
    window.requestAnimFrame(animloop);

    if (v.readyState === v.HAVE_ENOUGH_DATA) {
        Eyetrack.snapshot();
    }
}());
