var audioDevices;	
var BUFF_SIZE = 16384;

averageValue = 0;
largestFreq = 0;
largestValue = 0;
lastAverageValue = 0;

logoFrame = 12;
pulseFrame = 0;

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

         for (var i = 0; i < array.length; i++) {
        	 averageValue += array[i];
         }
         
         averageValue = averageValue / array.length;
         largestValue = Math.max.apply(null, array);
         largestFreq = array.indexOf(largestValue);

		 //dominance = largestValue / averageValue;
		 
		 pulse.visible = config.FLASHY;
		 middleLogo.visible = config.SHOW_MIDDLE_LOGO;
		 animatedLogo.visible = config.SHOW_ANIMATED_LOGO;

		 if (averageValue > lastAverageValue && logoFrame < 42){
			 logoFrame++;
		 }
		 else if (averageValue < lastAverageValue && logoFrame < 0){
			 logoFrame--;
		 }

		 if (averageValue > config.SENSITIVITY){
		 	middleLogo.frame = logoFrame;
		 	
		 	if (config.ASCENDING_LOGOS){
		 		ascendLogos(largestFreq * (game.scale.width / 100), averageValue * 32);
		 	}
		 	
			if (config.DROPPING_LOGOS){
		 		droppingLogos(largestFreq * (game.scale.width / 100), averageValue * 32);
		 	}
		 }
		 		
		 if (config.GET_SMALLER){
			middleLogo.scale.set(1 - averageValue / 100, 1 - averageValue / 100);
		 }
		 else{
			middleLogo.scale.set(0.7 + averageValue / 32, 0.7 + averageValue / 32);
		 }
		 
		 if (config.TURN_AROUND){
		 	middleLogo.angle += averageValue / 15;
		 }
		 else{
		 	middleLogo.angle = 0;
		 }
		 
		 pulseFrame = Math.round(averageValue * 8 / config.SENSITIVITY);
		 if (pulseFrame > 44) pulseFrame = 44;
		 
		 pulse.frame = pulseFrame;
		 animatedLogo.frame = pulseFrame;
		 
		 if (isMobile()){ // flasher
			 if (pulse.frame >= 38 && !window.plugins.flashlight.isSwitchedOn()){
			 	window.plugins.flashlight.switchOn();
			 	navigator.vibrate(2000);
			 }
			 else if (pulse.frame < 38 && window.plugins.flashlight.isSwitchedOn()){
		 		window.plugins.flashlight.switchOff();	
		 		navigator.vibrate(0);
			 }
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

function isMobile(){
    return /Mobi|Android/i.test(navigator.userAgent);
}