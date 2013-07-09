
// Modul Eyetrack
var Eyetrack = function() {

	var date = new Date();

	var starKernel = [
	                  [0,1,0],
	                  [1,1,1],
	                  [0,1,0],
	                 ];
	
	var discKernel = [
	                  [-1,0,-1],
	                  [-1,0,-1],
	                  [-1,0,-1],
	                 ];

	// Variablen
	var video 		= document.querySelector('video');

	// Zeichenflächen
	var cvFirst 	= document.querySelector('.cvFirst');
	var cvSecond 	= document.querySelector('.cvSecond');
	var cvThird 	= document.querySelector('.cvThird');

	// Graphicscontexte
	var ctxFirst 	= cvFirst.getContext('2d');
	var ctxSecond 	= cvSecond.getContext('2d');
	var ctxThird 	= cvThird.getContext('2d');

	var video_constraints = {
	   mandatory: {
	       maxHeight: 640,
	       maxWidth: 480 
	   },
	   optional: []
	};

	var stream 		= null;

	// ImageData für Bildbearbeitung
	var idFirst 	= null;
	var idSecond 	= null;

	// Einfacher Fehlerhandler
	var handleError = function(error) {
		console.log('Reeeejected!', error);
	};

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();


	// CanvasRenderingContext2D#getImageData()
	CanvasRenderingContext2D.prototype.getAllImageData = function() {
		return this.getImageData(0,0,this.canvas.width, this.canvas.height);
	};
	
	// CanvasRenderingContext2D#erode 
	CanvasRenderingContext2D.prototype.erode = function(B) {
		
		var start = (new Date).getTime();

		var A_ImageData = this.getAllImageData();

		var data 	= A_ImageData.data;
		var width 	= A_ImageData.width;
		var height 	= A_ImageData.height;

		var b1 = B[0][0];
		var b2 = B[0][1];
		var b3 = B[0][2];

		var b4 = B[1][0];
		var b5 = B[1][1];
		var b6 = B[1][2];

		var b7 = B[2][0]; 
		var b8 = B[2][1]; 
		var b9 = B[2][2];

		for (var x = 1; x < A_ImageData.width; ++x) {
			for (var y = 1; y < A_ImageData.height; ++y) {

				var y1_width = (y-1) * width;
				var y2_width = y * width;
				var y3_width = (y+1)* width;

				var index = (y * width + x) * 4;

				data[(x  + y2_width) * 4] = 
					data[(x - 1 + y1_width) * 4] * b1 +
					data[(x - 1 + y2_width) * 4] * b2 +
					data[(x - 1 + y3_width) * 4] * b3 +

					data[(x 	+ y1_width) * 4] *  b4 + 
					data[(x 	+ y2_width) * 4] *  b5 +
					data[(x 	+ y3_width) * 4] *  b6 +

					data[(x + 1 + y1_width) * 4] * b7 +
					data[(x + 1 + y2_width) * 4] * b8 +
					data[(x + 1 + y3_width)	* 4] * b9; 
			};
		};

		console.log("#erode took: %d ms", (new Date).getTime() - start);
	};

	// ImageData#treshold
	CanvasRenderingContext2D.prototype.treshold = function(B) {
		
		var A_ImageData = this.getAllImageData();
		var B_ImageData = B.getAllImageData();

		var height = A_ImageData.height;
		var width  = A_ImageData.width;

		console.log("this.canvas.height = %d, this.canvas.width = %d", height, width);

		var output = this.canvas.getContext('2d').createImageData(width,height);


		var ubound = width * height * 4;

		// Subtract images, discard alpha channel (modulo 4 Operation).
		for ( var i = 0; i < ubound; i++) {
			if (i % 4 < 3) {
				
				output.data[i] = A_ImageData.data[i] - B_ImageData.data[i];

				// Treshold image
				output.data[i] = (output.data[i] > 30) ? 255 : 0;

			} else {
				output.data[i] = A_ImageData.data[i];
			}
			;

		}
		;

		return output;
	}


	// Findet Objekte (Augen) im Bild
	var connect_objects = function(ctx) {
		var image_data = ctx.getAllImageData();



	}




	// Gebe Closure mit öffentlichen Methoden zurück.
	return {

		// Initialisiert alle Variablen und den Mediastream,
		// registriert die Snapshotfunktion
		initialize : function() {
			window.URL 				= 
				window.URL || 
				window.webkitURL;
			
			navigator.getUserMedia 	= 
				navigator.getUserMedia 			|| 
				navigator.webkitGetUserMedia 	|| 
				navigator.mozGetUserMedia 		|| 
				navigator.msGetUserMedia;

			if (navigator.getUserMedia) {
				navigator.getUserMedia({
					video : video_constraints
				}, function(videoStream) {
					video.src = window.URL.createObjectURL(videoStream);
					stream = videoStream;
				}, handleError);

			} else {
				video.src = 'somevideo.webm';
			}

		},
		
		snapshot :  function() {
			if (stream) {

				// Wenn das erste Sample leer ist, fülle dies.
				if (idFirst === false) {
					ctxFirst.drawImage(video, 0, 0, 640, 480);
					idFirst = true;
				}
				// Ansonsten schaue ob das zweite Sample leer ist, dann fülle dies.
				else {
					if (idSecond === false) {
						ctxSecond.drawImage(video, 0, 0, 640, 480);
						idSecond = true
						// Treshold Image berechnen (Differenz & Treshold)
						ctxThird.putImageData(ctxFirst.treshold(ctxSecond),0,0);
						
						// Open morphological operation (with a star-shaped kernel)
						//ctxThird.erode( starKernel );
						
						connect_objects(ctxThird);

					}
					// Wenn beide Sample gef¸llt sind, dann lösche beide.
					else {
						idFirst  = false;
						idSecond = false;
					}
					;
				}
				;

			}
		}
	};

}();

// Eyetrack initialisieren TODO: Initialisierung auslagern
Eyetrack.initialize();


(function animloop(){
  requestAnimFrame(animloop);
  Eyetrack.snapshot();
})();
