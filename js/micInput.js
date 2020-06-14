var audioDevices;	
var BUFF_SIZE = 16384;

var AMOUNT = 100;

averageValue = 0;
largestFreq = 0;
largestValue = 0;
lastAverageValue = 0;

frame = 12;

async function getDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices();
	audioDevices = devices.filter(device => device.kind === 'audioinput');

	navigator.getUserMedia( { audio: {deviceId: audioDevices[2].deviceId} },
        function(stream) {
    		start_stream(stream);
        },
        function(e) {
            alert(e);
        }
	);
}

function start_stream(stream){
	  var audioContext = new AudioContext();

      gain_node = audioContext.createGain();
      gain_node.connect( audioContext.destination );

      line_stream = audioContext.createMediaStreamSource(stream);
      line_stream.connect(gain_node); 

      script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);

      line_stream.connect(script_processor_node);

      gain_node.gain.value = 0;

      script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
      script_processor_fft_node.connect(gain_node);

      analyserNode = audioContext.createAnalyser();

      analyserNode.smoothingTimeConstant = 0;
      analyserNode.fftSize = 2048;

      line_stream.connect(analyserNode);

      analyserNode.connect(script_processor_fft_node);

      script_processor_fft_node.onaudioprocess = function() {
      	 var array = new Uint8Array(analyserNode.frequencyBinCount);
      	 analyserNode.getByteFrequencyData(array);

         for (var i = 0; i < AMOUNT; i++) {
        	 averageValue += array[i];
         }
         averageValue = averageValue / AMOUNT;

         largestValue = Math.max.apply(null, array);
        
         largestFreq = array.indexOf(largestValue);

		 dominance = largestValue / averageValue;

		 if (averageValue > lastAverageValue){
			 frame++;
		 }
		 else if (averageValue < lastAverageValue){
			 frame--;
		 }
		 
		 if (frame < 0) frame = 0;
		 else if (frame > 35) frame = 35;

		 var scalingPulse = averageValue / 20;
		 
		 logo.scale.set(0.55 - averageValue / 500, 0.55 - averageValue / 500);
		 logo.frame = frame; // logo.frame = Math.round(averageValue) * 3 - 8; //option B 
		 //logo.tint = 0xffffff * (largestFreq / 20) * (game.rnd.integerInRange(10, 50) / 100);
 
		 pulse.alpha = largestValue / 400;
		 pulse.scale.set(scalingPulse, scalingPulse);
		 pulse.frame = 2;
		 pulse.tint = 0xffffff * (largestFreq / 20) * (game.rnd.integerInRange(10, 50) / 100);
		 
		 pulse.angle++;

		 if (isMobile()){
			 if (scalingPulse >= 5 && !window.plugins.flashlight.isSwitchedOn()){
			 	window.plugins.flashlight.switchOn();
			 }
			 else if (scalingPulse < 5 && window.plugins.flashlight.isSwitchedOn()){
		 		window.plugins.flashlight.switchOff();	 	
			 }
		 }
 
		 lastAverageValue = averageValue;
		
  	 	 blue = 255 - Math.round(averageValue * dominance);
  	 	 if (blue > 255) blue = 255;
  	 	 else if (blue < 0) blue = 0;

  	 	 game.stage.backgroundColor = 'rgba(' + 0 + ', ' + 0 + ',' + blue + ',' + 0.2 + ')';
 	};
 }

 function generateColor(value) {
    var r = Math.round(value * 255),
        g = Math.round((1 - Math.abs(0.5 - value)) * 255),
        b = Math.round((1 - value) * 255);
    var finalValue = (0xff000000 + 0x10000 * b + 256 * g + r).toString(16);

    return '0x' + finalValue ;
}

function isMobile(){
    return /Mobi|Android/i.test(navigator.userAgent);
}