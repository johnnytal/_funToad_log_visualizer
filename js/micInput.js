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
		 else if (frame > 32) frame = 32;

		 if (averageValue > config.SENSITIVITY){
		 	if (config.ASCENDING_LOGOS){
		 		ascendLogos(largestFreq * 200, averageValue * 14);
		 	}
		 	
			if (config.DROPPING_LOGOS){
		 		droppingLogos(largestFreq * 200, averageValue * 14);
		 	}
 		    middleLogo.frame = frame;
		 }
		 		
		 if (config.GET_SMALLER){
			middleLogo.scale.set(1 - averageValue / 100, 1 - averageValue / 100);
		 }
		 else{
			middleLogo.scale.set(0.5 + averageValue / 25, 0.5 + averageValue / 25);
		 }
		 
		 if (config.TURN_AROUND){
		 	middleLogo.angle += averageValue / 15;
		 }
		 else{
		 	middleLogo.angle = 0;
		 }

		 pulse.frame = Math.round(averageValue * 5 / config.SENSITIVITY);
		 //pulse.scale.set(1.43 + averageValue / 25, 3.254 + averageValue / 25);

		 if (isMobile()){
			 if (pulse.frame >= 22 && !window.plugins.flashlight.isSwitchedOn()){
			 	window.plugins.flashlight.switchOn();
			 }
			 else if (pulse.frame < 22 && window.plugins.flashlight.isSwitchedOn()){
		 		window.plugins.flashlight.switchOff();	 	
			 }
		 }
		 
   	 	 if (!config.FLASHY){
  	 	 	 pulse.visible = false;
  	 	 }
  	 	 else{
  	 	 	pulse.visible = true;
  	 	 }
 
		 if (config.COLORFUL){
	 	 	 pulse.alpha = 0.5;

	  	 	 value = Math.round(averageValue * 8);
	  	 	 if (value > 255) value = 255;
	  	 	 else if (value < 0) value = 0;
	
	  	 	 game.stage.backgroundColor = 'rgba(' + value + ', ' + value + ',' + value + ',' + 1 + ')';
  	 	 }

  	 	 else{
  	 	 	 pulse.alpha = 1;
  	 	 	 game.stage.backgroundColor = 0x000000;
  	 	 }
  	 	 
  	 	 lastAverageValue = averageValue;
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