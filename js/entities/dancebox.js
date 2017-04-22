/**
 * Dance box
 */

 game.DanceBox = me.Container.extend({

     /**
      * constructor
      */
     init : function (x, y, width, height) {
	 // call the constructor
	 this._super(me.Container, 'init', [x, y , width, height]);
     },

     draw : function(renderer) {
	renderer.setColor('#ffffff');
	renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
     },

     update: function (dt) {
          this._super(me.Container, "update", [dt]);
	  return true;
     }
 });
