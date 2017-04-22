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
	 this.stepState = 0;
     },

     draw : function(renderer) {
	//debug code. TODO remove it
	this.stepState = (me.timer.getTime() / 666.667) % 6;

	renderer.setColor('#ffffff');
	renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

	var leftFootState = Math.floor(((this.stepState + 1)%6)/2);
	var rightFootState = Math.floor(this.stepState/2);

	//Starting position for left food
	var xl = this.pos.x + this.width/8;
	var yl = this.pos.y + 7*this.height/8;
	var xr = this.pos.x + 3*this.width/8;
	var yr = this.pos.y + 7*this.height/8;
	switch(leftFootState){
	    case 0:
	    default:
	    	break; //do nothing
	    case 1:
		//Left foot in forward position
		yl -= 3*this.height/4;
		break;
	    case 2:
	    	//left foot in forward/right
	    	yl -= 3*this.height/4;
		xl += this.width/2;
	}
	switch(rightFootState){
	    case 0:
	    default:
	    	break; //do nothing
	    case 1:
		//right foot in forward/right position
		yr -= 3*this.height/4;
		xr += this.width/2;
		break;
	    case 2:
	    	//right foot in right/back position
		xr += this.width/2;
        }
	renderer.strokeEllipse(xl, yl, this.width/8, this.height/8);
	renderer.strokeEllipse(xr, yr, this.width/8, this.height/8);
     },

     update: function (dt) {
          this._super(me.Container, "update", [dt]);
	  return true;
     }
 });
