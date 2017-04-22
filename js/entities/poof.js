/**
 * Poof effect
 */

 game.Poof = me.Sprite.extend({
     /**
      * constructor
      */
     init : function (x, y, good, implode) {
	 // call the constructor
	 this._super(me.Sprite, 'init', [x, y , {image: good ? "poof" : "badpoof", framewidth: 256, frameheight: 256}]);
	 this.lifeTime = 666.667; //in ms
         this.addAnimation("poof", [0, 1, 2, 3, 4, 5, 6], this.lifeTime/6);
	 this.addAnimation("foop", [5, 4, 3, 2, 1, 0, 6], this.lifeTime/6);
  	 this.setCurrentAnimation(implode ? "foop" : "poof");
  	 this.createTime = me.timer.getTime();
     },

     draw : function(renderer) {
	this._super(me.Sprite, 'draw', [renderer]);
     },

     update: function (dt) {
          this._super(me.Sprite, "update", [dt]);
	  if(me.timer.getTime() - this.createTime >= this.lifeTime){
	    me.game.world.removeChild(this);
	  }
	  return true;
     }
 });
