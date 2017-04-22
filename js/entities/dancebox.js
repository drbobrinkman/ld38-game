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

    	 //TODO: Remove this, just use target list and time to draw these
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
		    	permittedSlop: 12,
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
	me.game.DB.checkTarget(e,"down");
     },

     handleUp : function(e) {
	if(me.game.pointers.hasOwnProperty(e.pointerId)){
	    delete me.game.pointers[e.pointerId];
	}
	me.game.DB.checkTarget(e,"up");
  	//console.log(Object.keys(me.game.pointers).length);
     },

     checkTarget : function(e, kind) {
	if(kind == "down"){
	    //Check if this even satisfies any targets. Can only satisfy one target
	    var whichTarget = -1;
	    var curCount = (me.timer.getTime() - me.game.DB.phraseStartTime)/me.game.DB.msPerBeat;
	    //For a target to be valid, must touch within appropriate radius and appropriate time
	    // window
	    for(var targnum in me.game.DB.curPhrase.targets){
		if(Math.abs(curCount - me.game.DB.curPhrase.targets[targnum].count) <=
		    me.game.DB.curPhrase.targets[targnum].permittedSlop){
		    //Okay, time is a match. Now check location
		    var p = new me.Vector2d(e.gameX, e.gameY);
		    if(me.game.DB.targets[me.game.DB.curPhrase.targets[targnum].targetNum].distance(p) <= me.game.DB.width/8){
		    	//The player hit this target
			whichTarget = targnum;
			break;
		    }
		}
	    }
	    if(whichTarget != -1){
		//TODO: Happy visual effect
	    	delete me.game.DB.curPhrase.targets[whichTarget];
	    }
	}
     },

     draw : function(renderer) {
	this._super(me.Container, 'draw', [renderer]);

	var curCount = (me.timer.getTime() - me.game.DB.phraseStartTime)/me.game.DB.msPerBeat;
	for(var targnum in me.game.DB.curPhrase.targets){
	    var targ = me.game.DB.curPhrase.targets[targnum];
	    var countDiff = Math.abs(curCount - targ.count)/targ.permittedSlop;
	    if(countDiff <= 1.0){
		renderer.setColor(new me.Color(255, 255, 255, 1.0 - countDiff));
		renderer.strokeEllipse(this.targets[targ.targetNum].x, this.targets[targ.targetNum].y, 
			this.width/8, this.height/8);
	    }
	}
     },

     update: function (dt) {
          this._super(me.Container, "update", [dt]);
	  var now = me.timer.getTime();

	  if((now - this.phraseStartTime)/this.msPerBeat >= this.curPhrase.counts){ 
	      	this.phraseStartTime = now;
		if(Object.keys(this.curPhrase.targets).length > 0){
		    //failed
		    this.danceState = this.curPhrase.onFailure;
		} else {
		    //succeeded
		    this.danceState = this.curPhrase.onSuccess;
		}

		this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
		me.audio.play(this.curPhrase.tune);
	  }
	  return true;
     }
 });
