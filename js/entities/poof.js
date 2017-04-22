/**
 * Poof effect
 */

 game.Poof = me.Renderable.extend({
     /**
      * constructor
      */
     init : function (x, y, width, height) {
	 // call the constructor
	 this._super(me.Renderable, 'init', [x, y , width, height]);
     	 this.createTime = me.timer.getTime();
	 this.lifeTime = 1000; //in ms
     },

     draw : function(renderer) {
	this._super(me.Renderable, 'draw', [renderer]);

	renderer.setColor(new me.Color(255, 255, 255, 1.0 -(me.timer.getTime() - this.createTime)/this.lifeTime));
	renderer.strokeEllipse(this.pos.x, this.pos.y, this.width, this.height);
     },

     update: function (dt) {
          this._super(me.Renderable , "update", [dt]);
	  if(me.timer.getTime() - this.createTime > this.lifeTime){
	    me.game.DB.removeChild(this);
	  }
	  return true;
     }
 });
