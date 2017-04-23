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

	 this.font = new me.BitmapFont(me.loader.getBinary('GreatVibes48'), 
	     me.loader.getImage('GreatVibes48'));
	 
	 this.danceState = 0; //Tells us which part of the song we are in. 
	 this.bpm = 90;
	 this.msPerBeat = 60*1000/this.bpm;

         this.dbSprite = new me.Sprite(0, 0, {image: "AnimatedDanceBox", framewidth: 512, frameheight: 512});
	 this.dbSprite.addAnimation("ripple", [0, 1, 2], 200);
	 this.dbSprite.addAnimation("death", [0, 3, 4], 2000);
	 this.dbSprite.addAnimation("dead", [4]);
	 this.dbSprite.setCurrentAnimation("ripple");

	 var scaleF = 1.25 * width / this.dbSprite.width;
	 this.dbSprite.scaleV(new me.Vector2d(scaleF, scaleF));
	 this.addChild(this.dbSprite,5);
	 this.dbSprite.pos.x = width/(2*scaleF);
	 this.dbSprite.pos.y = height/(2*scaleF);

	 me.game.pointers = new Object(); //Will use as associative array to hold
	 // info about status of pointers
	 //TODO: Tried to use this.pointers but it didn't work. Not sure why.
	 // investiage someday

	 //Subscribe to pointer events
	 this.pointerDown= me.event.subscribe("pointerdown", this.handleDown);
	 this.pointerUp= me.event.subscribe("pointerup", this.handleUp);

	 this.targets = [
	 	new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			me.game.DB.pos.y + 7*me.game.DB.height/8),
		    new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			    me.game.DB.pos.y + me.game.DB.height/8),
		    new me.Vector2d(me.game.DB.pos.x + 5*me.game.DB.width/8,
			    me.game.DB.pos.y + me.game.DB.height/8),
		    new me.Vector2d(me.game.DB.pos.x + 3*me.game.DB.width/8,
			    me.game.DB.pos.y + 7*me.game.DB.height/8),
		    new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			    me.game.DB.pos.y + me.game.DB.height/8),
		    new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			    me.game.DB.pos.y + 7*me.game.DB.height/8)
	 ];

	 this.phraseStartTime = me.timer.getTime();

     	 this.song = [{
	 tune: "Intro1",
	 counts: 12,
	 onSuccess: 1,
	 onFailure: 0,
	 targets: [{
			targetNum: 0,	
	   		count: 3,
		    	permittedSlop: 9,
		   },{
		    	targetNum: 3,
		    	count: 3,
		    	permittedSlop: 9,
		   }]
     }, {
	 tune: "MainBoxStep",
	 counts: 24,
	 onSuccess: 1,
	 onFailure: 2, 
	 targets: [{
	     		targetNum: 1,
			count: 0,
			permittedSlop: 0.5,
		   },{
		       targetNum: 4,
		       count: 1,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 2,
		       count: 2,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 5,
		       count: 3,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 0,
		       count: 4,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 3,
		       count: 5,
		       permittedSlop: 0.5,
		   },{
	     		targetNum: 1,
			count: 6,
			permittedSlop: 0.5,
		   },{
		       targetNum: 4,
		       count: 7,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 2,
		       count: 8,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 5,
		       count: 9,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 0,
		       count: 10,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 3,
		       count: 11,
		       permittedSlop: 0.5,
		   },{
	     		targetNum: 1,
			count: 12,
			permittedSlop: 0.5,
		   },{
		       targetNum: 4,
		       count: 13,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 2,
		       count: 14,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 5,
		       count: 15,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 0,
		       count: 16,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 3,
		       count: 17,
		       permittedSlop: 0.5,
		   },{
	     		targetNum: 1,
			count: 18,
			permittedSlop: 0.5,
		   },{
		       targetNum: 4,
		       count: 19,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 2,
		       count: 20,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 5,
		       count: 21,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 0,
		       count: 22,
		       permittedSlop: 0.5,
		   },{
		       targetNum: 3,
		       count: 23,
		       permittedSlop: 0.5,
		   }
		 ]
     }, {
	tune: "SadMusic",
	counts: 12,
	onSuccess: 0,
	onFailure: 0, 
	targets: []
     }
	 ] //end song

	//I want a deep copy, and I don't know what I'm doing.
	this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
	this.nextPhrase = JSON.parse(JSON.stringify(this.song[this.curPhrase.onSuccess]));
	this.curTune = me.audio.play(this.curPhrase.tune);
     },

     handleDown : function(e) {
	me.game.pointers[e.pointerId] = e;
	me.game.DB.checkTarget(e,"down");
     },

     handleUp : function(e) {
	if(me.game.pointers.hasOwnProperty(e.pointerId)){
	    delete me.game.pointers[e.pointerId];
	}
	me.game.DB.checkTarget(e,"up");
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
		    if(me.game.DB.targets[me.game.DB.curPhrase.targets[targnum].targetNum].distance(p) 
			<= me.game.DB.width/4){
		    	//The player hit this target
			whichTarget = targnum;
			break;
		    }
		}
	    }
	    if(whichTarget != -1){
		me.game.world.addChild(new game.Poof(e.gameX, e.gameY, 
				true),10);
	    	me.game.DB.curPhrase.targets.splice(whichTarget, 1);
	    }
	}
     },

     draw : function(renderer) {
	 this._super(me.Container, 'draw', [renderer]);
	 this.font.draw(renderer, "Could we yet do something? Or shall we just\ndance away the hour until the world runs down?", 20, me.game.world.height - 120);
     },

     update: function (dt) {
          this._super(me.Container, "update", [dt]);
	  var now = me.timer.getTime();
	  var curCount = (me.timer.getTime() - me.game.DB.phraseStartTime)/me.game.DB.msPerBeat;

	  // If missed a target, make a sad graphic
	  for(i = 0; i < me.game.DB.curPhrase.targets.length; i++){
	      var targ = me.game.DB.curPhrase.targets[i];
	      if(!targ){
		  console.log("oop");
	      }
	      var countDiff = curCount - targ.count; //if countDiff > permittedSlop, we are done
	      if(countDiff > targ.permittedSlop){
		  me.game.world.addChild(new game.Poof(this.targets[targ.targetNum].x, 
			      this.targets[targ.targetNum].y,
			      false),10);
		  this.danceState = this.curPhrase.onFailure;

		  me.audio.stop("Intro1");
		  me.audio.stop("MainBoxStep", this.curTune);

		  //TODO: I'm a bad person, I'm repeating the "start over" code
		  // too many places
		  this.phraseStartTime = now;
		  this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
		  this.nextPhrase = JSON.parse(JSON.stringify(this.song[this.curPhrase.onSuccess]));
		  this.curTune = me.audio.play(this.curPhrase.tune);
		  if(this.danceState == 0){
		      this.dbSprite.setCurrentAnimation("ripple");
		  } else if (this.danceState == 2) {
		      this.dbSprite.setCurrentAnimation("death","dead");
		  }
		  return true;
	      }
	  } 
	  
	  //This section: Make a tap cue for upcoming steps
	  for(var targnum in me.game.DB.curPhrase.targets){
	      var targ = me.game.DB.curPhrase.targets[targnum];
	      var countDiff = curCount - targ.count; //When it goes from < -1 to >= -1 we need to act
	      if(countDiff >= -1 && countDiff - dt/me.game.DB.msPerBeat < -1){
	      	me.game.world.addChild(new game.Foop(this.targets[targ.targetNum].x, 
			    this.targets[targ.targetNum].y,
			    (targ.permittedSlop - countDiff)*me.game.DB.msPerBeat),10);
	      }
	  }
	  //Also render the steps from the next stage of the song, assuming success
	  curCount -= me.game.DB.curPhrase.counts;
	  for(var targnum in this.nextPhrase.targets) {
	      var targ = me.game.DB.nextPhrase.targets[targnum];
	      var countDiff = curCount - targ.count; //When it goes from < -1 to >= -1 we need to act
	      if(countDiff >= -1 && countDiff - dt/me.game.DB.msPerBeat < -1){
	      	me.game.world.addChild(new game.Foop(this.targets[targ.targetNum].x, 
			    this.targets[targ.targetNum].y,
			    (targ.permittedSlop - countDiff)*me.game.DB.msPerBeat),10);
	      }
	  }

	  if((now - this.phraseStartTime)/this.msPerBeat >= this.curPhrase.counts){ 
	      this.phraseStartTime = now;
	      if(Object.keys(this.curPhrase.targets).length > 0){
		  //failed
		  this.danceState = this.curPhrase.onFailure;
		  this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
	      } else {
		  //succeeded
		  this.danceState = this.curPhrase.onSuccess;
		  this.curPhrase = this.nextPhrase;
	      }

	      this.nextPhrase = JSON.parse(JSON.stringify(this.song[this.curPhrase.onSuccess]));
	      this.curTune = me.audio.play(this.curPhrase.tune);
	      if(this.danceState == 0){
		  this.dbSprite.setCurrentAnimation("ripple");
	      } else if (this.danceState == 2) {
		  this.dbSprite.setCurrentAnimation("death","dead");
	      }
	  }
	  return true;
     }
 });
