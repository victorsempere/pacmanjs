enchant();

window.onload = function(){
	var maxHeight = $(document).height(); 
	$("#enchant-stage").css("min-height", maxHeight);

	var gameWidth = 480;
	var gameHeight = 496;
	var game = new Game(gameWidth, gameHeight);
	game.fps = 30;
	game.spriteSheetWidth = 256;
	game.spriteSheetHeight = 256;
	game.spriteWidth = 16;
	game.spriteHeight = 16;
  	game.preload('assets/enchant/images/pacmanSprites.gif');

	var map = new Map(game.spriteWidth, game.spriteHeight);
	var foregroundMap = new Map(game.spriteWidth, game.spriteHeight);
	var player = new Sprite(game.spriteWidth, game.spriteHeight);

	var setMaps = function(){
		map.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
		map.loadData(mapData);

		foregroundMap.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
		foregroundMap.loadData(foregroundData);

	    var collisionData = [];
	    for(var i = 0; i< mapData.length; i++){
	      collisionData.push([]);
	      for(var j = 0; j< mapData[0].length; j++){
	        var collision = mapData[i][j] >= 0 ? 1 : 0;
	        collisionData[i][j] = collision;
	      }
	    }
	    map.collisionData = collisionData;
	};

	player.move = function(){
		this.frame = this.spriteOffset + this.direction * 3 + this.walk;

		if (this.isMoving) {
		  this.moveBy(this.xMovement, this.yMovement);
		  if (!(game.frame % 3)) {
		    this.walk++;
		    this.walk %= 3;
		  }
		  if ((this.xMovement && this.x % 16 === 0) || (this.yMovement && this.y % 16 === 0)) {
			  if (this.xMovement || this.yMovement) {
			    var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
			    var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);
			  if (0 <= x && x < map.width && 0 <= y && y < map.height && map.hitTest(x, y)) {
			    this.isMoving = false;
			  	}
			  }
		    this.walk = 1;
		
		  }
		  
		} else {
		  this.xMovement = 0;
		  this.yMovement = 0;
		  if (game.input.up) {
		    this.direction = 0;
		    this.yMovement = -4;
		  } else if (game.input.right) {
		    this.direction = 1;
		    this.xMovement = 4;
		  } else if (game.input.left) {
		    this.direction = 2;
		    this.xMovement = -4;
		  } else if (game.input.down) {
		    this.direction = 3;
		    this.yMovement = 4;
		  }
		  if (this.xMovement || this.yMovement) {
		    var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
		    var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);
		  if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
		      this.isMoving = true;
		      this.move();
		  	}
		  }
		}
	};

	var setStage = function(){
		var stage = new Group();
		stage.addChild(map);
	    stage.addChild(player);
		stage.addChild(foregroundMap);

		game.rootScene.addChild(stage);
	};

	var setPlayer = function(){
		player.spriteOffset = 33;
		player.startingX = 14;
		player.startingY = 17;
		player.x = player.startingX * game.spriteWidth;
		player.y = player.startingY * game.spriteHeight;
		player.direction = 0;
		player.walk = 0;
		player.frame = player.spriteOffset + player.direction; 
		player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
		player.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
	};

	game.onload = function(){
		setMaps();
		setPlayer();
		setStage();

	    player.on('enterframe', function() {
			player.move();
    	});
	};

	game.start();
};
