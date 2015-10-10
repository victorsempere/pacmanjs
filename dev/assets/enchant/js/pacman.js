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
function Enemy(width, height) {
	Sprite.call(this, width, height);
}

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.aStarMovement = function(player) {
	this.requestedDirection = Math.floor(Math.random() * 3);
	switch(this.requestedDirection) {
		case 0:
			this.requestedYMovement = -4;
			this.requestedXMovement = 0;
			break;

		case 1:
			this.requestedXMovement = 4;
			this.requestedYMovement = 0;
			break;

		case 2:
			this.requestedXMovement = -4;
			this.requestedYMovement = 0;
			break;

		case 3:
			this.requestedYMovement = 4;
			this.requestedXMovement = 0;
			break;
	}
};

Enemy.prototype.move = function(player) {
		this.frame = this.spriteOffset + this.direction * 2 + this.walk;

		if (this.isMoving) {
			this.moveBy(this.xMovement, this.yMovement);

			if (!(this.frame % 2)) {
				this.walk++;
				this.walk %= 2;
			}

			if (this.x<=0 && this.y==(14*game.spriteHeight)) {
				this.x = gameWidth - game.spriteWidth;				

			} else if (this.x>=(gameWidth-game.spriteWidth) && this.y==(14*game.spriteHeight)) {
				this.x = this.xMovement;

			} else {
				if ((this.direction==0 && this.requestedDirection==3) || (this.direction==3 && this.requestedDirection==0) || 
					(this.direction==1 && this.requestedDirection==2) || (this.direction==2 && this.requestedDirection==1)) {
					this.xMovement = this.requestedXMovement;
					this.yMovement = this.requestedYMovement;
					this.direction = this.requestedDirection;
					this.requestedXMovement = 0;
					this.requestedYMovement = 0;
					this.requestedDirection = -1;						

				} else {
					if ((this.xMovement && this.x % 16 === 0) || (this.yMovement && this.y % 16 === 0)) {
						if (this.direction!=this.requestedDirection && this.requestedDirection>-1) {
							var x = this.x + (this.requestedXMovement ? this.requestedXMovement / Math.abs(this.requestedXMovement) * 16 : 0);
							var y = this.y + (this.requestedYMovement ? this.requestedYMovement / Math.abs(this.requestedYMovement) * 16 : 0);

							if (!map.hitTest(x, y)) {
								this.xMovement = this.requestedXMovement;
								this.yMovement = this.requestedYMovement;
								this.direction = this.requestedDirection;
								this.requestedXMovement = 0;
								this.requestedYMovement = 0;
								this.requestedDirection = -1;						
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
			// Decide where to move
			this.aStarMovement(player);

			if (this.requestedXMovement || this.requestedYMovement) {
				var x = this.x + (this.requestedXMovement ? this.requestedXMovement / Math.abs(this.requestedXMovement) * 16 : 0);
				var y = this.y + (this.requestedYMovement ? this.requestedYMovement / Math.abs(this.requestedYMovement) * 16 : 0);

				if (!map.hitTest(x, y)) {
					this.xMovement = this.requestedXMovement;
					this.yMovement = this.requestedYMovement;
					this.direction = this.requestedDirection;
					this.requestedXMovement = 0;
					this.requestedYMovement = 0;
					this.requestedDirection = -1;
					
					this.isMoving = true;
					this.move(player);
				}
			}
		}
	};

	var maxHeight = $(document).height(); 
	$("#enchant-stage").css("min-height", maxHeight);

	var pillsandpowerupsCollected = 0;
	var powerUpsCollected = 0;

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
	player.requestedDirection = -1;
	player.requestedXMovement = 0;
	player.requestedYMovement = 0;


	var pinky = new Enemy(game.spriteWidth, game.spriteHeight);
	pinky.requestedDirection = -1;
	pinky.requestedXMovement = 0;
	pinky.requestedYMovement = 0;

	var morado = new Enemy(game.spriteWidth, game.spriteHeight);
	morado.requestedDirection = -1;
	morado.requestedXMovement = 0;
	morado.requestedYMovement = 0;

	var blue = new Enemy(game.spriteWidth, game.spriteHeight);
	blue.requestedDirection = -1;
	blue.requestedXMovement = 0;
	blue.requestedYMovement = 0;

	var yellow = new Enemy(game.spriteWidth, game.spriteHeight);
	yellow.requestedDirection = -1;
	yellow.requestedXMovement = 0;
	yellow.requestedYMovement = 0;

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
			this.requestedDirection = 0;
			this.requestedYMovement = -4;
			this.requestedXMovement = 0;

		} else if (game.input.right) {
			this.requestedDirection = 1;
			this.requestedXMovement = 4;
			this.requestedYMovement = 0;

		} else if (game.input.left) {
			this.requestedDirection = 2;
			this.requestedXMovement = -4;
			this.requestedYMovement = 0;

		} else if (game.input.down) {
			this.requestedDirection = 3;
			this.requestedYMovement = 4;
			this.requestedXMovement = 0;
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
				if ((this.direction==0 && this.requestedDirection==3) || (this.direction==3 && this.requestedDirection==0) || 
					(this.direction==1 && this.requestedDirection==2) || (this.direction==2 && this.requestedDirection==1)) {
					this.xMovement = this.requestedXMovement;
					this.yMovement = this.requestedYMovement;
					this.direction = this.requestedDirection;
					this.requestedXMovement = 0;
					this.requestedYMovement = 0;
					this.requestedDirection = -1;						

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

						if (this.direction!=this.requestedDirection && this.requestedDirection>-1) {
							var x = this.x + (this.requestedXMovement ? this.requestedXMovement / Math.abs(this.requestedXMovement) * 16 : 0);
							var y = this.y + (this.requestedYMovement ? this.requestedYMovement / Math.abs(this.requestedYMovement) * 16 : 0);

							if (!map.hitTest(x, y)) {
								this.xMovement = this.requestedXMovement;
								this.yMovement = this.requestedYMovement;
								this.direction = this.requestedDirection;
								this.requestedXMovement = 0;
								this.requestedYMovement = 0;
								this.requestedDirection = -1;						
							}
						}

						var x = this.x + (this.xMovement ? this.xMovement / Math.abs(this.xMovement) * 16 : 0);
						var y = this.y + (this.yMovement ? this.yMovement / Math.abs(this.yMovement) * 16 : 0);

						if (map.hitTest(x, y)) {
							this.xMovement = 0;
							this.yMovement = 0;
							this.isMoving = false;
						}	
					}
				}		  
			}

		} else {
			if (this.requestedXMovement || this.requestedYMovement) {
				var x = this.x + (this.requestedXMovement ? this.requestedXMovement / Math.abs(this.requestedXMovement) * 16 : 0);
				var y = this.y + (this.requestedYMovement ? this.requestedYMovement / Math.abs(this.requestedYMovement) * 16 : 0);

				if (!map.hitTest(x, y)) {
					this.xMovement = this.requestedXMovement;
					this.yMovement = this.requestedYMovement;
					this.direction = this.requestedDirection;
					this.requestedXMovement = 0;
					this.requestedYMovement = 0;
					this.requestedDirection = -1;
					
					this.isMoving = true;
					this.move();
				}
			}
		}
	};

	var setStage = function(){
		var stage = new Group();
		stage.addChild(map);
		stage.addChild(pillsandpowerups);
	    stage.addChild(player);
	    stage.addChild(pinky);
	    stage.addChild(morado);
	    stage.addChild(blue);
	    stage.addChild(yellow);

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

	var setPinky = function() {
		pinky.spriteOffset = 64;
		pinky.startingX = 2;
		pinky.startingY = 20;
		pinky.x = pinky.startingX * game.spriteWidth;
		pinky.y = pinky.startingY * game.spriteHeight;
		pinky.direction = 0;
		pinky.walk = 0;
		pinky.frame = pinky.spriteOffset + pinky.direction; 
		pinky.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
		pinky.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
	}

	var setMorado = function() {
		morado.spriteOffset = 80;
		morado.startingX = 26;
		morado.startingY = 20;
		morado.x = morado.startingX * game.spriteWidth;
		morado.y = morado.startingY * game.spriteHeight;
		morado.direction = 0;
		morado.walk = 0;
		morado.frame = morado.spriteOffset + morado.direction; 
		morado.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
		morado.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
	}

	var setBlue = function() {
		blue.spriteOffset = 112;
		blue.startingX = 26;
		blue.startingY = 1;
		blue.x = blue.startingX * game.spriteWidth;
		blue.y = blue.startingY * game.spriteHeight;
		blue.direction = 0;
		blue.walk = 0;
		blue.frame = blue.spriteOffset + blue.direction; 
		blue.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
		blue.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
	}


	var setYellow = function() {
		yellow.spriteOffset = 128;
		yellow.startingX = 2;
		yellow.startingY = 1;
		yellow.x = yellow.startingX * game.spriteWidth;
		yellow.y = yellow.startingY * game.spriteHeight;
		yellow.direction = 0;
		yellow.walk = 0;
		yellow.frame = yellow.spriteOffset + yellow.direction; 
		yellow.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
		yellow.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
	}

	game.onload = function(){
		setMaps();
		setPlayer();
		setPinky();
		setMorado();
		setBlue();
		setYellow();
		setStage();

	    player.on('enterframe', function() {
			player.move();
    	});
    	pinky.on('enterframe', function() {
    		pinky.move(player);
    	});
    	morado.on('enterframe', function() {
    		morado.move(player);
    	});
    	blue.on('enterframe', function() {
    		blue.move(player);
    	});
    	yellow.on('enterframe', function() {
    		yellow.move(player);
    	});

	};

	game.start();
};
