var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.spritesheet('logo_spritesheet', 'assets/logo_spritesheet.png', 10368 / 36, 384);
        game.load.spritesheet('flash', 'assets/flash.png', 3000 / 5, 3042 / 9);
        game.load.spritesheet('logo_animation', 'assets/logo_animation.png', 3000 / 5, 3300 / 10);
        
        //game.load.spritesheet('pulse_spritesheet', 'assets/pulsing-electric-ball.png', 2048 / 4, 1024 / 2);
    },
    
    create: function(){
        this.game.state.start("Logo"); 
    }
};