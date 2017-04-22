game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

	//Start the soundtrack. TODO: change to the intro music
        me.audio.playTrack("MainBoxStep");

	me.game.world.addChild(new me.ColorLayer("background", "#00003f"), 0);
	
	var ssize = me.game.viewport.width / 3;
	me.game.world.addChild(new game.DanceBox(me.game.viewport.width/2 - ssize/2, 
						 me.game.viewport.height/2 - ssize/2, ssize, ssize));

	// Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
	// stop the music
	me.audio.stopTrack();
	
	// remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
