var logoMain = function(game){};

logoMain.prototype = {
    create: function(){
        game.stage.backgroundColor = '0x000000';
    	 
    	pulse = game.add.sprite(0, 0, 'pulse_spritesheet');
    	pulse.anchor.set(.5, .5);
    	pulse.x = game.world.centerX;
    	pulse.y = game.world.centerY;
    	
    	logo = game.add.sprite(0, 0, 'logo_spritesheet');
    	logo.anchor.set(.5, .5);
    	logo.x = game.world.centerX;
    	logo.y = game.world.centerY;
    	
    	pulse.alpha = 0;
    	
    	if (isMobile()){
    		startMic();
    	}
    	else{
			setTimeout(function(){
				getDevices();
			}, 500);
    	}
    }
};

function startMic(){
	try{
		window.audioinput.checkMicrophonePermission(function(hasPermission) {
			if (hasPermission){
				webaudio_tooling_obj();
			}
		    else{
		        window.audioinput.getMicrophonePermission(function(hasPermission, message) {
		        	if (hasPermission) {
						webaudio_tooling_obj();		
		        	}
		        	else{
		        		alert('Microphone permission needed for app to work!');
		        	}
		        });
		    }
		});
	} catch(e){
		alert('Please give microphone permission via Settings > Apps ' + e);
	}	

    try{
        window.plugins.insomnia.keepAwake();
    } catch(e){}   
}

function webaudio_tooling_obj(){
	if (!navigator.getUserMedia){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true}, 
            function(stream) {
                start_stream(stream);
            },
            function(e) {
                alert(e);
            }
        );
    } else { alert('getUserMedia not supported in this browser'); }
}