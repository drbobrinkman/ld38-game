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

	 //This is a total hack because I don't understand scope in Javascript TODO
	 me.game.DB = this;

	 this.stepState = 0; //0 is feet together in lower left
	 this.danceState = 0; //0 is intro, 1 is main song, 2 is gameover
	 this.bpm = 90;
	 this.msPerBeat = 60*1000/this.bpm;
	 this.introDone = false;

         var dbSprite = new me.Sprite(0, 0, {image: "DanceBox"});
	 var scaleF = 1.25 * width / dbSprite.width;
	 dbSprite.scaleV(new me.Vector2d(scaleF, scaleF));
	 this.addChild(dbSprite);
	 dbSprite.pos.x = width/(2*scaleF);
	 dbSprite.pos.y = height/(2*scaleF);

	 me.game.pointers = new Object(); //Will use as associative array to hold
	 // info about status of pointers
	 //TODO: Tried to use this.pointers but it didn't work. Not sure why.
	 // investiage someday

	 //Subscribe to pointer events
	 this.pointerDown= me.event.subscribe("pointerdown", this.handleDown);
	 this.pointerUp= me.event.subscribe("pointerup", this.handleUp);

	 this.targets = new Object();
	 this.targets[0] = new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			   	me.game.DB.pos.y + 7*me.game.DB.height/8);
	 this.targets[1] = new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			   	me.game.DB.pos.y + me.game.DB.height/8);
	 this.targets[2] = new me.Vector2d(me.game.DB.pos.x + 5*me.game.DB.width/8,
			   	me.game.DB.pos.y + me.game.DB.height/8);
	 this.targets[3] = new me.Vector2d(me.game.DB.pos.x + 3*me.game.DB.width/8,
			  	me.game.DB.pos.y + 7*me.game.DB.height/8);
	 this.targets[4] = new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			  	me.game.DB.pos.y + me.game.DB.height/8);
	 this.targets[5] = new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			  	me.game.DB.pos.y + 7*me.game.DB.height/8);

	 this.phraseStartTime = me.timer.getTime();

     	 this.song = [{
	 tune: "Intro1",
	 counts: 12,
	 onSuccess: 1,
	 onFailure: 0,
	 targets: [{
			targetNum: 0,	
	   		count: 0,
		    	permittedSlop: 12,
		   },{
		    	targetNum: 3,
		    	count: 0,
		    	permittedSlopt: 12,
		   }]
     }, {
	 tune: "MainBoxStep",
	 counts: 24,
	 onSuccess: 1,
	 onFailure: 0, 
	 targets: [{
	     		targetNum: 1,
			count: 1,
			permittedSlop: 0.25,
		   },{
		       targetNum: 4,
		       count: 2,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 2,
		       count: 3,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 5,
		       count: 4,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 0,
		       count: 5,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 3,
		       count: 6,
		       permittedSlop: 0.25,
		   },{
	     		targetNum: 1,
			count: 7,
			permittedSlop: 0.25,
		   },{
		       targetNum: 4,
		       count: 8,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 2,
		       count: 9,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 5,
		       count: 10,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 0,
		       count: 11,
		       permittedSlop: 0.25,
		   },{
		       targetNum: 3,
		       count: 12,
		       permittedSlop: 0.25,
		   }
		 ]
     	        }
	      ]
	//I want a deep copy, and I don't know what I'm doing.
	this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
	me.audio.play(this.curPhrase.tune);
     },

     handleDown : function(e) {
	me.game.pointers[e.pointerId] = e;
	//TODO: Should be based on resolution, not hard-coded to 20
	me.game.DB.addChild(new game.Poof(e.gameX-me.game.DB.pos.x, e.gameY-me.game.DB.pos.y, 20, 20));
  	//console.log(Object.keys(me.game.pointers).length);
     },

     handleUp : function(e) {
	if(me.game.pointers.hasOwnProperty(e.pointerId)){
	    delete me.game.pointers[e.pointerId];
	}
  	//console.log(Object.keys(me.game.pointers).length);
     },

     draw : function(renderer) {
	this._super(me.Container, 'draw', [renderer]);

	renderer.setColor('#ffffff');

	var leftFootState = Math.floor(((this.stepState + 1)%6)/2);
	var rightFootState = Math.floor(this.stepState/2);

	renderer.strokeEllipse(this.targets[leftFootState].x, this.targets[leftFootState].y, 
		this.width/8, this.height/8);
	renderer.strokeEllipse(this.targets[rightFootState+3].x, this.targets[rightFootState+3].y, 
		this.width/8, this.height/8);
     },

     update: function (dt) {
          this._super(me.Container, "update", [dt]);
	  var now = me.timer.getTime();

	  switch(this.danceState){
	      case 0:
	      default:
		  //Starting positions for feet
		  var l = new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			  me.game.DB.pos.y + 7*me.game.DB.height/8);
		  var r = new me.Vector2d(me.game.DB.pos.x + 3*me.game.DB.width/8,
			  me.game.DB.pos.y + 7*me.game.DB.height/8);
		  //if pointers are down in roughly the right place, at any
		  // point during the intro, move on to
		  // main song
		  var radius = this.width/16;
		  var leftokay = false;
		  var rightokay = false;
		  for(var prop in me.game.pointers){
		  	var e = me.game.pointers[prop];
			var p = new me.Vector2d(e.gameX, e.gameY);
			if(l.distance(p) < radius){
			    leftokay = true;
			}
			if(r.distance(p) < radius){
			    rightokay = true;
			}
		  }
		  if(leftokay && rightokay){
		      this.introDone = true;
		  }

		  if((now - this.phraseStartTime)/this.msPerBeat >= this.phraseCounts){ 
		      this.phraseStartTime = now;
		      if(this.introDone) {
			  this.danceState = 1;
			  this.introDone = false;
			  this.phraseCounts = 24; //main song is 8 bars
			  me.audio.play("MainBoxStep");
		      } else {
			  this.phraseCounts = 12; //intro is 4 bars
			  me.audio.play("Intro1");
		      }
		  }
		  break;
	  }
	  return true;
     }
 });
