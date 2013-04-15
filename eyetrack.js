// Modul Eyetrack
var Eyetrack = function() {

	// Variablen
	var video = document.querySelector('video');
	
	// Zeichenflächen
	var cvFirst = document.querySelector('.cvFirst');
	var cvSecond = document.querySelector('.cvSecond');
	var cvThird = document.querySelector('.cvThird');
	
	// Graphicscontexte
	var ctxFirst = cvFirst.getContext('2d');
	var ctxSecond = cvSecond.getContext('2d');
	var ctxThird = cvThird.getContext('2d');
	
	var stream = null;

	// ImageData für Bildbearbeitung
	var idFirst = null;
	var idSecond = null;

	// Einfacher Fehlerhandler
	var handleError = function(error) {
		console.log('Reeeejected!', error);
	};

	// Berechne das Binärbild aus der Differenz der beiden Sample.
	var calcBinary = function(firstSample, secondSample) {
		var w = firstSample.width;
		var h = firstSample.height;

		var output = ctxFirst.createImageData(w, h);

		var ubound = w * h * 4;

		// Subtract images, discard alpha channel.
		for ( var i = 0; i < ubound; i++) {
			if( i % 4 < 3 ) {
				output.data[i] = firstSample.data[i] - secondSample.data[i];
			} else {
				output.data[i] = firstSample.data[i];
			};
			
			
		};

		return output;
	};

	// Zeichnet aktuelles Streambild in den Context2d
	var snapshot = function() {
		if (stream) {
			

			// Wenn das erste Sample leer ist, fülle dies.
			if (idFirst === null) {
				ctxFirst.drawImage(video, 0, 0, 320, 240);
				idFirst = ctxFirst.getImageData(0, 0, 320, 240);
			}
			// Ansonsten schaue ob das zweite Sample leer ist, dann fülle dies.
			else {
				if (idSecond === null) {
					ctxSecond.drawImage(video, 0,0,320,240);
					idSecond = ctxSecond.getImageData(0, 0, 320, 240);

					ctxThird.putImageData(calcBinary(idFirst, idSecond), 0, 0);
				}
				// Wenn beide Sample gefüllt sind, dann lösche beide.
				else {
					idFirst = null;
					idSecond = null;
				}
				;
			}
			;

		}
	};

	// Gebe Closure mit öffentlichen Methoden zurück.
	return {

		// Initialisiert alle Variablen und den Mediastream,
		// registriert die Snapshotfunktion
		initialize : function() {
			window.URL = window.URL || window.webkitURL;
			navigator.getUserMedia = navigator.getUserMedia
					|| navigator.webkitGetUserMedia
					|| navigator.mozGetUserMedia || navigator.msGetUserMedia;

			if (navigator.getUserMedia) {
				navigator.getUserMedia({
					video : true
				}, function(videoStream) {
					video.src = window.URL.createObjectURL(videoStream);
					stream = videoStream;
				}, handleError);

				video.addEventListener('click', snapshot, false);
			} else {
				video.src = 'somevideo.webm';
			}

		},

		getImageData : function() {
			return imageData;
		}
	};

}();

// Eyetrack initialisieren TODO: Initialisierung auslagern
Eyetrack.initialize();
