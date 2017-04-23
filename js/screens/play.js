game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

	this.BG = new me.ImageLayer(0, 0, {image: "bg"});
	me.game.world.addChild(new me.ImageLayer(0, 0, {image: "bg"}), 0);
	
	var ssize = me.game.viewport.width / 3;
	this.DB = new game.DanceBox(me.game.viewport.width/2 - ssize/2, 
	    me.game.viewport.height/2 - ssize/2, ssize, ssize);
	me.game.world.addChild(this.DB,1);

	// Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

	//Register for pointer events for whole screen, distribute via pubsub
	me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
	        me.event.publish("pointerdown", [ event ]);
	});
	me.input.registerPointerEvent("pointerup", me.game.viewport, function (event) {
	        me.event.publish("pointerup", [ event ]);
	});
	//This is a work-around because pointerdown seems to be broken in android
	if(me.device.android){
	    me.input.registerPointerEvent("pointerenter", me.game.viewport, function (event) {
		me.event.publish("pointerdown", [ event ]);
	    });
	    me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
		me.event.publish("pointerdown", [ event ]);
	    });
	}
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
	me.game.world.removeChild(this.DB);
	// remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
