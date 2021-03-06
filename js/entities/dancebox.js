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

         this.dbSprite = new me.Sprite(0, 0, {image: "DanceBoxFG", framewidth: 384, 
	     frameheight: 384});
	 this.dbSprite.addAnimation("healthy", [0]);
	 this.dbSprite.addAnimation("death", [0, 1, 2], 1000);
	 this.dbSprite.addAnimation("dead", [2]);
	 this.dbSprite.setCurrentAnimation("healthy");

         this.waterSprite = new me.Sprite(0, 0, {image: "WaterRipples", framewidth: 384, 
	     frameheight: 384});
	 this.waterSprite.addAnimation("ripple", [0, 1, 2], 200);
	 this.waterSprite.setCurrentAnimation("ripple");
	 
	 this.addChild(this.dbSprite,5);
	 this.dbSprite.pos.x = width/4;
	 this.dbSprite.pos.y = height/4;
	 this.dbSprite.scale(2.0);
	 this.addChild(this.waterSprite,4);
	 this.waterSprite.pos.x = width/4;
	 this.waterSprite.pos.y = height/4;
	 this.waterSprite.scale(2.0);

	 this.beginSprite = new me.Sprite(0, 0, {image: "begin", framewidth: 710, frameheight: 533});
	 this.addChild(this.beginSprite, 6);
	 this.beginSprite.pos.x = 140;
	 this.beginSprite.pos.y = 150;
	 this.beginSprite.scale(2.0);

	 this.tutSprite = new me.Sprite(0, 0, {image: "boxinst", framewidth: 710, frameheight: 533});
	 this.addChild(this.tutSprite, 6);
	 this.tutSprite.pos.x = 140;
	 this.tutSprite.pos.y = 150;
	 this.tutSprite.scale(2.0);
	 this.tutSprite.setOpacity(0.0);

	 me.game.pointers = new Object(); //Will use as associative array to hold
	 // info about status of pointers
	 //TODO: Tried to use this.pointers but it didn't work. Not sure why.
	 // investiage someday

	 //Subscribe to pointer events
	 this.pointerDown= me.event.subscribe("pointerdown", this.handleDown);
	 this.pointerUp= me.event.subscribe("pointerup", this.handleUp);

	 this.targets = [
	     //left foot positions
	     new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
		     me.game.DB.pos.y + 7*me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 5*me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
	     //right foot positions
		 new me.Vector2d(me.game.DB.pos.x + 3*me.game.DB.width/8,
			 me.game.DB.pos.y + 7*me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 7*me.game.DB.width/8,
			 me.game.DB.pos.y + 7*me.game.DB.height/8),
	     //left foot flourishes
	     new me.Vector2d(me.game.DB.pos.x - me.game.DB.width/8,
		     me.game.DB.pos.y + 7*me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x - me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 3*me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
	     //right foot flourishes
		new me.Vector2d(me.game.DB.pos.x + 5*me.game.DB.width/8,
			 me.game.DB.pos.y + 7*me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 9*me.game.DB.width/8,
			 me.game.DB.pos.y + me.game.DB.height/8),
		 new me.Vector2d(me.game.DB.pos.x + 9*me.game.DB.width/8,
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
	 onSuccess: 3,
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
	counts: 9,
	onSuccess: 0,
	onFailure: 0, 
	targets: []
     }, {
	 tune: "Bassoon1",
	 counts: 24,
	 onSuccess: 4,
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
		   },
		   {
	     		targetNum: 1,
			count: 6,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 6.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 7,
		       permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 10,
			count: 7.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 8,
		       permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 8,
			count: 8.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 7,
			count: 18.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 19,
		       permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 10,
			count: 19.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 20,
		       permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 8,
			count: 20.5,
			permittedSlop: 0.5,
		   },
		   {
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
	 tune: "Bassoon2",
	 counts: 24,
	 onSuccess: 5,
	 onFailure: 2, 
	 targets: [
	 	   {
	     		targetNum: 1,
			count: 0,
			permittedSlop: 0.5,
		   },
	 	   {
	     		targetNum: 7,
			count: 0.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 6,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 6.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 12,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 12.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 18,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 18.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 19,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 10,
		       count: 19.5,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 20,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 8,
		       count: 20.5,
		       permittedSlop: 0.5,
		   },
		   {
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
	 tune: "Bassoon3",
	 counts: 24,
	 onSuccess: 6,
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
		   },
		   {
	     		targetNum: 1,
			count: 6,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 6.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 7,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 10,
		       count: 7.5,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 8,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 8,
		       count: 8.5,
		       permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 12,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 12.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 18,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 18.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 19,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 10,
		       count: 19.5,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 20,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 8,
		       count: 20.5,
		       permittedSlop: 0.5,
		   },
		   {
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
	 tune: "BassoonEnd",
	 counts: 24,
	 onSuccess: 0,
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
		   },
		   {
	     		targetNum: 1,
			count: 12,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 12.5,
			permittedSlop: 0.5,
		   },
		   {
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
		   },
		   {
	     		targetNum: 1,
			count: 18,
			permittedSlop: 0.5,
		   },
		   {
	     		targetNum: 7,
			count: 18.5,
			permittedSlop: 0.5,
		   },
		   {
		       targetNum: 4,
		       count: 19,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 10,
		       count: 19.5,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 2,
		       count: 20,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 8,
		       count: 20.5,
		       permittedSlop: 0.5,
		   },
		   {
		       targetNum: 5,
		       count: 21,
		       permittedSlop: 0.5,
		   }
		 ]
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
	 var radius = 96;
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
			<= radius){
		    	//The player hit this target
			whichTarget = targnum;
			var tmp = me.pool.pull("poof", e.gameX, e.gameY); 
			if(!me.game.world.hasChild(tmp)) {
		    	  me.game.world.addChild(tmp, 10);
			}	
			me.game.DB.curPhrase.targets.splice(whichTarget, 1);
			break;
		    }
		}
	    }
	    curCount -= me.game.DB.curPhrase.counts;
	    if(whichTarget == -1){
		for(var targnum in me.game.DB.nextPhrase.targets){
		    if(Math.abs(curCount - me.game.DB.nextPhrase.targets[targnum].count) <=
			    me.game.DB.nextPhrase.targets[targnum].permittedSlop){
			//Okay, time is a match. Now check location
			var p = new me.Vector2d(e.gameX, e.gameY);
			if(me.game.DB.targets[me.game.DB.nextPhrase.targets[targnum].targetNum]
			    .distance(p) <= radius){
			    //The player hit this target
			    whichTarget = targnum;
			    var tmp = me.pool.pull("poof", e.gameX, e.gameY);
			    if(!me.game.world.hasChild(tmp)) {
		    	   	me.game.world.addChild(tmp, 10);
			    }
			    me.game.DB.nextPhrase.targets.splice(whichTarget, 1);
			    break;
			}
		    }
		}
	    }
	    if(this.danceState == 0 && Object.keys(this.curPhrase.targets).length == 0){
		this.beginSprite.setOpacity(0.0);
		this.tutSprite.setOpacity(1.0);
	    } else if (this.danceState != 0) {
		this.beginSprite.setOpacity(0.0);
		this.tutSprite.setOpacity(0.0);
	    } else {
		this.beginSprite.setOpacity(1.0);
		this.tutSprite.setOpacity(0.0);
	    }
	}
     },

     draw : function(renderer) {
	 this._super(me.Container, 'draw', [renderer]);
	 this.font.draw(renderer, "Could we yet do something? Or shall we just\ndance away the hour until the world runs down?", 1200, me.game.world.height - 120);
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
		  var tmp = me.pool.pull("badpoof", this.targets[targ.targetNum].x, 
			      this.targets[targ.targetNum].y);
		  if(!me.game.world.hasChild(tmp)) {
		      me.game.world.addChild(tmp, 10);
		  }
		  this.danceState = this.curPhrase.onFailure;

		  me.audio.stop("Intro1", this.curTune);
		  me.audio.stop("MainBoxStep", this.curTune);
		  me.audio.stop("Bassoon1", this.curTune);
		  me.audio.stop("Bassoon2", this.curTune);
		  me.audio.stop("Bassoon3", this.curTune);
		  me.audio.stop("BassoonEnd", this.curTune);

		  //TODO: I'm a bad person, I'm repeating the "start over" code
		  // too many places
		  this.phraseStartTime = now;
		  this.curPhrase = JSON.parse(JSON.stringify(this.song[this.danceState]));
		  this.nextPhrase = JSON.parse(JSON.stringify(this.song[this.curPhrase.onSuccess]));
		  this.curTune = me.audio.play(this.curPhrase.tune);
		  if(this.danceState == 0){
		      this.dbSprite.setCurrentAnimation("healthy");
		      this.beginSprite.setOpacity(1.0);
		      this.tutSprite.setOpacity(0.0);
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
	      	var tmp = me.pool.pull("foop", this.targets[targ.targetNum].x, 
			    this.targets[targ.targetNum].y,
			    (targ.permittedSlop - countDiff)*me.game.DB.msPerBeat);
		if(!me.game.world.hasChild(tmp)) {
		    me.game.world.addChild(tmp, 10);
		}
	      }
	  }
	  //Also render the steps from the next stage of the song, assuming success
	  curCount -= me.game.DB.curPhrase.counts;
	  for(var targnum in this.nextPhrase.targets) {
	      var targ = me.game.DB.nextPhrase.targets[targnum];
	      var countDiff = curCount - targ.count; //When it goes from < -1 to >= -1 we need to act
	      if(countDiff >= -1 && countDiff - dt/me.game.DB.msPerBeat < -1){
	      	var tmp = me.pool.pull("foop", this.targets[targ.targetNum].x, 
			    this.targets[targ.targetNum].y,
			    (targ.permittedSlop - countDiff)*me.game.DB.msPerBeat);
		if(!me.game.world.hasChild(tmp)) {
		    me.game.world.addChild(tmp, 10);
		}
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
		  this.dbSprite.setCurrentAnimation("healthy");
		  this.beginSprite.setOpacity(1.0);
		  this.tutSprite.setOpacity(0.0);
	      } else if (this.danceState == 2) {
		  this.dbSprite.setCurrentAnimation("death","dead");
	      }
	  }
	  return true;
     }
 });
