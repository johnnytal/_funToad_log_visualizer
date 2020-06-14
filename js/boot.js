//window.onload = start;
document.addEventListener("deviceready", start, false);

function start(){
	var gameRatio = window.innerWidth / window.innerHeight;
	
    WIDTH = Math.ceil(480*gameRatio); 
    HEIGHT = 640; 

    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, "container");  

    game.state.add("Boot", boot);
    game.state.add("Preloader", preloader);
    game.state.add("Logo", logoMain);
    
    game.state.start("Boot");  
}

var boot = function(game){};
  
boot.prototype = {
    create: function(){

        if (!this.game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.maxWidth = window.innerWidth * window.devicePixelRatio;
            this.scale.maxHeight = window.innerHeight * window.devicePixelRatio;
            
            this.scale.forceOrientation(true, false);
        } 
        
        game.state.start("Preloader"); 
    }
};