window.onload = start;
document.addEventListener("deviceready", start, false);

function start(){
	var gameRatio = window.innerWidth / window.innerHeight;
	
    WIDTH = 850; 
    HEIGHT = 1100; 

    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, "container");  

    game.state.add("Boot", boot);
    game.state.add("Preloader", preloader);
    game.state.add("Logo", logoMain);
    
    game.state.start("Boot");  
}

var boot = function(game){};
  
boot.prototype = {
    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.maxWidth = window.innerWidth * window.devicePixelRatio;
        this.scale.maxHeight = window.innerHeight * window.devicePixelRatio;
        
        this.scale.forceOrientation(true, false);

        game.state.start("Preloader"); 
    }
};