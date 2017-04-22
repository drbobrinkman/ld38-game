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
	 this.stepState = 0; //0 is feet together in lower left
	 this.danceState = 0; //0 is intro, 1 is main song, 2 is gameover
	 this.bpm = 90;
	 this.msPerBeat = 60*1000/this.bpm;

         var dbSprite = new me.Sprite(0, 0, {image: "DanceBox"});
	 var scaleF = 1.25 * width / dbSprite.width;
	 dbSprite.scaleV(new me.Vector2d(scaleF, scaleF));
	 this.addChild(dbSprite);
	 dbSprite.pos.x = width/(2*scaleF);
	 dbSprite.pos.y = height/(2*scaleF);

	 this.phraseStartTime = me.timer.getTime();
	 this.phraseCounts = 12; //intro is 4 bars
	 me.audio.play("Intro1");
     },

     draw : function(renderer) {
	this._super(me.Container, 'draw', [renderer]);

	renderer.setColor('#ffffff');

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
	  var now = me.timer.getTime();

	  switch(this.danceState){
	      case 0:
	      default:
	  	if((now - this.phraseStartTime)/this.msPerBeat >= this.phraseCounts){ 
		    this.phraseStartTime = now;
		    this.phraseCounts = 12; //intro is 4 bars
		    me.audio.play("Intro1");
		}
		break;
	  }
	  return true;
     }
 });
