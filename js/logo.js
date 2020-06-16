var logoMain = function(game){
	config = {
		SENSITIVITY: 15,
		COLORFUL: false,
		GET_SMALLER: true,
		TURN_AROUND: false,
		ASCENDING_LOGOS: false,
		DROPPING_LOGOS: false,
		FLASHY: true
		
	};
};

logoMain.prototype = {
    create: function(){
    	pulse = game.add.sprite(0, 0, 'flash');
    	pulse.anchor.set(.5, .5);
    	pulse.x = game.world.centerX;
    	pulse.y = game.world.centerY;
    	pulse.alpha = 0.6;
    	pulse.scale.set(1.43, 3.254);
    	
    	if (isMobile()){
    		startMic();
    	}
    	else{
			setTimeout(function(){
				getDevices();
			}, 500);
    	}
    	
    	createMiddleLogo();
    	
    	startGUI();
    }
};

function createMiddleLogo(){
	middleLogo = game.add.sprite(0, 0, 'logo_spritesheet');
	
	middleLogo.anchor.set(.5, .5);
	middleLogo.x = game.world.centerX;
	middleLogo.y = game.world.centerY;
}

function droppingLogos(StartX, velY){
	logoDrop = game.add.sprite(StartX, 0, 'logo_spritesheet');
	
	game.physics.enable(logoDrop, Phaser.Physics.ARCADE);
    
    logoDrop.body.velocity.setTo(0, velY);
    
	logoDrop.frame = frame;

    tween = game.add.tween(logoDrop).to( { alpha: 0 }, 5000, "Linear", true);
    tween.onComplete.add(function(){ logoDrop.destroy; }, this);
}

function ascendLogos(StartX, startY){
	logoAscend = game.add.sprite(StartX, HEIGHT - startY, 'logo_spritesheet');
	
	logoAscend.frame = frame;

    tween = game.add.tween(logoAscend).to( { alpha: 0 }, 350, "Linear", true);
    tween.onComplete.add(function(){ logoAscend.destroy; }, this);
}

function startGUI(){
    var gui = new dat.GUI({ width: 300 });
    gui.add(config, 'COLORFUL').name('WHITEN');
    gui.add(config, 'GET_SMALLER').name('GET_SMALLER');
    gui.add(config, 'TURN_AROUND').name('TURN_AROUND');
    gui.add(config, 'ASCENDING_LOGOS').name('ASCENDING_LOGOS');
    gui.add(config, 'DROPPING_LOGOS').name('DROPPING_LOGOS');
    gui.add(config, 'FLASHY').name('FLASHY');
	gui.add(config, 'SENSITIVITY', 1, 50).name('Sensitivity').step(1);
	
    /*gui.add(config, 'SOUND', { 'Vibraphone': 0, 'Glockenspiel': 1, 'Harp': 2, 'Pan': 3 , 'Pizzicato' : 4 }).name('Instrument');
    gui.add(config, 'SCALE', { 'Chromatic' : 0, 'Major': 1, 'Minor': 2, 'Pentatonic': 3, 'Blues': 4}).name('Scale');
    */
   
    //if (isMobile()) gui.close();
}

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