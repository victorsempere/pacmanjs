enchant();

Map.prototype.setTile = function(x, y, tileValue) {
	if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
		return false;
	}

	var width = this._image.width;
	var height = this._image.height;
	var tileWidth = this._tileWidth || width;
	var tileHeight = this._tileHeight || height;
	x = x / tileWidth | 0;
	y = y / tileHeight | 0;

	var data = this._data[0];
	var oldData = data[y][x];

	data[y][x]=tileValue;

	this._dirty = true;

	return oldData;
};

window.onload = function(){
	var maxHeight = $(document).height(); 
	$("#enchant-stage").css("min-height", maxHeight);

	var pillsandpowerupsCollected = 0;
	var powerUpsCollected = 0;
	var requestedDirection = -1;
	var requestedXMovement = 0;
	var requestedYMovement = 0;

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
	var pillsandpowerups = new Map(game.spriteWidth, game.spriteHeight);
	var player = new Sprite(game.spriteWidth, game.spriteHeight);

	var setMaps = function(){
		map.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
		map.loadData(mapData);
	    var collisionData = [];
	    for(var i = 0; i< mapData.length; i++){
	      collisionData.push([]);
	      for(var j = 0; j< mapData[0].length; j++){
	        var collision = mapData[i][j] >= 0 ? 1 : 0;
	        collisionData[i][j] = collision;
	      }
	    }
	    map.collisionData = collisionData;

		pillsandpowerups.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
		pillsandpowerups.loadData(pillsandpowerupsData);
	 	var pillsandpowerupsCollisionData = [];
	    for(var i = 0; i< pillsandpowerupsData.length; i++){
	      pillsandpowerupsCollisionData.push([]);
	      for(var j = 0; j< pillsandpowerupsData[0].length; j++){
	        var collision = pillsandpowerupsData[i][j] >= 0 ? 1 : 0;
	        pillsandpowerupsCollisionData[i][j] = collision;
	      }
	    }
	    pillsandpowerups.collisionData = pillsandpowerupsCollisionData;
	};

	player.move = function(){
		this.frame = this.spriteOffset + this.direction * 3 + this.walk;

		if (game.input.up) {
			requestedDirection = 0;
			requestedYMovement = -4;
			requestedXMovement = 0;

		} else if (game.input.right) {
			requestedDirection = 1;
			requestedXMovement = 4;
			requestedYMovement = 0;

		} else if (game.input.left) {
			requestedDirection = 2;
			requestedXMovement = -4;
			requestedYMovement = 0;

		} else if (game.input.down) {
			requestedDirection = 3;
			requestedYMovement = 4;
			requestedXMovement = 0;
		}

		if (this.isMoving) {
			this.moveBy(this.xMovement, this.yMovement);

			if (!(game.frame % 3)) {
				this.walk++;
				this.walk %= 3;
			}

			if (this.x<=0 && this.y==(14*game.spriteHeight)) {
				this.x = gameWidth - game.spriteWidth;				

			} else if (this.x>=(gameWidth-game.spriteWidth) && this.y==(14*game.spriteHeight)) {
				this.x = this.xMovement;

			} else {
				if ((this.direction==0 && requestedDirection==3) || (this.direction==3 && requestedDirection==0) || 
					(this.direction==1 && requestedDirection==2) || (this.direction==2 && requestedDirection==1)) {
					this.xMovement = requestedXMovement;
					this.yMovement = requestedYMovement;
					this.direction = requestedDirection;
					requestedXMovement = 0;
					requestedYMovement = 0;
					requestedDirection = -1;						

				} else {
					if ((this.xMovement && this.x % 16 === 0) || (this.yMovement && this.y % 16 === 0)) {
						var checkTile = pillsandpowerups.checkTile(this.x, this.y);
						if (checkTile>=0) {
							pillsandpowerups.setTile(this.x, this.y, -1);

							if (checkTile==151) {
								pillsandpowerupsCollected++;
								$("#score").html("Score " + pillsandpowerupsCollected);

							} else {
								powerUpsCollected++;
								$("#powerUps").html("Power ups: " + powerUpsCollected);
							}
						}

						if (this.direction!=requestedDirection && requestedDirection>-1) {
							var x = this.x + (requestedXMovement ? requestedXMovement / Math.abs(requestedXMovement) * 16 : 0);
							var y = this.y + (requestedYMovement ? requestedYMovement / Math.abs(requestedYMovement) * 16 : 0);

							if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
								this.xMovement = requestedXMovement;
								this.yMovement = requestedYMovement;
								this.direction = requestedDirection;
								requestedXMovement = 0;
								requestedYMovement = 0;
								requestedDirection = -1;						
							}
						}

						var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
						var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);

						if (0 <= x && x < map.width && 0 <= y && y < map.height && map.hitTest(x, y)) {
							this.xMovement = 0;
							this.yMovement = 0;
							this.isMoving = false;
						}	
					}
				}		  
			}

		} else {
			if (requestedXMovement || requestedYMovement) {
				var x = this.x + (requestedXMovement ? requestedXMovement / Math.abs(requestedXMovement) * 16 : 0);
				var y = this.y + (requestedYMovement ? requestedYMovement / Math.abs(requestedYMovement) * 16 : 0);

				if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
					this.xMovement = requestedXMovement;
					this.yMovement = requestedYMovement;
					this.direction = requestedDirection;
					requestedXMovement = 0;
					requestedYMovement = 0;
					requestedDirection = -1;
					
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
		stage.addChild(pillsandpowerups);

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
