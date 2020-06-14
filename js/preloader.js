var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.spritesheet('logo_spritesheet', 'assets/logo_spritesheet.png', 10368 / 36, 384);
        game.load.spritesheet('pulse_spritesheet', 'assets/pulsing-electric-ball.png', 2048 / 4, 1024 / 2);
    },
    
    create: function(){
        this.game.state.start("Logo"); 
    }
};