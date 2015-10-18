enchant();

window.onload = function(){
	// Scenes
	var sceneBoard;
	var sceneGameOver;

	// Game elements
	var map;
	var pillsandpowerups;
	var player;
	var pinky;
	var morado;
	var blue;
	var yellow;
	var scoreLabel;
	var levelLabel;

	// Tiles
	var lifeSpriteNumber = 37;
	var pill = 161;
	var pillPowerUp = 160;
	var spriteGhostEaten = 96;
	var spriteVulnerable = 144;

	// Game constants
	var maxLifes = 3;
	var pointsPerPill = 10;
	var powerUpTimeout = 5000;
	var totalPills = 299;
	var gameWidth = 480;
	var gameHeight = 544;

	// Game values
	var startTime = 0;
	var lifes = maxLifes;
	var level = 1;
	var score = 0;
	var pillscollected = 0;
	var ghostsEat = 0;
	var powerUpsCollected = 0;
	var gameOver = false;

	Map.prototype.setTile = function(x, y, tileValue) {
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

	function Enemy(width, height) {
		Sprite.call(this, width, height);
	}

	Enemy.prototype = Object.create(Sprite.prototype);
	Enemy.prototype.ghostEaten = function() {
		this.spriteOffset = spriteGhostEaten;
	}

	Enemy.prototype.setVulnerable = function(isVulnerable) {
		this.isVulnerable = isVulnerable;
		
		if (isVulnerable) {
			this.spriteOffset = spriteVulnerable;

		} else {
			this.spriteOffset = this.originalSpriteOffset;
		}
	};

	Enemy.prototype.aStarMovement = function(player) {
		this.requestedDirection = Math.floor(Math.random() * 4);

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

	Enemy.prototype.move = function(player, map, game) {
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

						if (map.hitTest(x, y)) {
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
					this.move(player, map, game);
				}
			}
		}
	};

	var game = new Game(gameWidth, gameHeight);
	game.fps = 30;
	game.spriteSheetWidth = 256;
	game.spriteSheetHeight = 256;
	game.spriteWidth = 16;
	game.spriteHeight = 16;
  	game.preload('assets/enchant/images/pacmanSprites.gif');
	game.setPowerUp = function() {
		if (this.powerUpTimer) {
			window.clearTimeout(this.powerUpTimer);
		}
		pinky.setVulnerable(true);
		morado.setVulnerable(true);
		blue.setVulnerable(true);
		yellow.setVulnerable(true);
		this.powerUpTimer = window.setTimeout(game.setPowerUpOff, powerUpTimeout);
	};
	game.setPowerUpOff = function() {
		this.powerUpTimer = null;

		pinky.setVulnerable(false);
		morado.setVulnerable(false);
		blue.setVulnerable(false);
		yellow.setVulnerable(false);
	}

	var setLifes = function(context, image) {
		var srcy = Math.floor(lifeSpriteNumber/game.spriteHeight) * game.spriteHeight;
		var srcx = (lifeSpriteNumber-srcy)*game.spriteWidth;
		var x = 13 * game.spriteWidth ;
		var y = 32 * game.spriteHeight - 10;

		var finalSize = game.spriteWidth*2;
		for (var i=0; i<lifes; i++) {
			 context.drawImage(image, srcx, srcy, game.spriteWidth, game.spriteHeight, x+ (i*finalSize), y, finalSize, finalSize);
		}

	}
	var setMaps = function(){
		if (!map) {
			map = new Map(game.spriteWidth, game.spriteHeight);
			map.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
		}

		var newMapData = [];
	    var collisionData = [];
	    for(var i = 0; i< mapData.length; i++){
	      collisionData.push([]);
	      newMapData.push(mapData[i].slice());

	      for(var j = 0; j< mapData[0].length; j++){
	        var collision = mapData[i][j] >= 0 ? 1 : 0;
	        collisionData[i][j] = collision;
	      }
	    }

		map.loadData(newMapData);
	    map.collisionData = collisionData;

	    if (!pillsandpowerups) {
			pillsandpowerups = new Map(game.spriteWidth, game.spriteHeight);
			pillsandpowerups.image = game.assets['assets/enchant/images/pacmanSprites.gif'];
	    }
		var newPillsandpowerupsData = [];
	 	var pillsandpowerupsCollisionData = [];
	    for(var i = 0; i< pillsandpowerupsData.length; i++){
	      pillsandpowerupsCollisionData.push([]);
	      newPillsandpowerupsData.push(pillsandpowerupsData[i].slice());

	      for(var j = 0; j< pillsandpowerupsData[0].length; j++){
	        var collision = pillsandpowerupsData[i][j] >= 0 ? 1 : 0;
	        pillsandpowerupsCollisionData[i][j] = collision;
	      }
	    }
		pillsandpowerups.loadData(newPillsandpowerupsData);
	    pillsandpowerups.collisionData = pillsandpowerupsCollisionData;

	    map.on(Event.ENTER_FRAME, function(e) {
	    	setLifes(e.target._context, e.target.image._element);
	    })
	};


	var setPlayer = function(){
		if (!player) {
			player = new Sprite(game.spriteWidth, game.spriteHeight);
			player.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			player.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
			player.loseLife = function() {
				lifes--;
				if (lifes<=0) {
					setGameOver();

				} else {
					setStage();
				}
			} 
			player.setRequestedDirectionFromTouch = function(x, y) {
				var dx = Math.abs(this.x - x);
				var dy = Math.abs(this.y - y);

				if (dx>dy) {
					if (this.x<x) {
						this.requestedDirection = 1;
						this.requestedXMovement = 4;
						this.requestedYMovement = 0;

					} else {
						this.requestedDirection = 2;
						this.requestedXMovement = -4;
						this.requestedYMovement = 0;
					}
				
				} else {
					if (this.y<y) {
						this.requestedDirection = 3;
						this.requestedYMovement = 4;
						this.requestedXMovement = 0;

					} else {
						this.requestedDirection = 0;
						this.requestedYMovement = -4;
						this.requestedXMovement = 0;
					}
				}
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

									setScore();
									pillscollected++;
									score += pointsPerPill;

									if (checkTile!=pill) {
										game.setPowerUp();
										powerUpsCollected++;
									}

									if (pillscollected>=totalPills) {
										setNextLevel();
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
		}

		player.isMoving = false;
		player.requestedDirection = -1;
		player.requestedXMovement = 0;
		player.requestedYMovement = 0;
		player.spriteOffset = 33;
		player.startingX = 14;
		player.startingY = 17;
		player.x = player.startingX * game.spriteWidth;
		player.y = player.startingY * game.spriteHeight;
		player.xMovement = 0;
		player.yMovement = 0;
		player.direction = 0;
		player.walk = 0;
		player.frame = player.spriteOffset + player.direction; 
	};

	var setPinky = function() {
		if (!pinky) {
			pinky = new Enemy(game.spriteWidth, game.spriteHeight);
			pinky.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			pinky.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
		}

		pinky.isMoving = false;
		pinky.requestedDirection = -1;
		pinky.requestedXMovement = 0;
		pinky.requestedYMovement = 0;
		pinky.spriteOffset = 64;
		pinky.originalSpriteOffset = pinky.spriteOffset;
		pinky.startingX = 2;
		pinky.startingY = 20;
		pinky.x = pinky.startingX * game.spriteWidth;
		pinky.y = pinky.startingY * game.spriteHeight;
		pinky.direction = 0;
		pinky.xMovement = 0;
		pinky.yMovement = 0;
		pinky.walk = 0;
		pinky.frame = pinky.spriteOffset + pinky.direction; 
	}

	var setMorado = function() {
		if (!morado) {
			morado = new Enemy(game.spriteWidth, game.spriteHeight);
			morado.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			morado.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
		}

		morado.isMoving = false;
		morado.requestedDirection = -1;
		morado.requestedXMovement = 0;
		morado.requestedYMovement = 0;
		morado.spriteOffset = 80;
		morado.originalSpriteOffset = morado.spriteOffset;
		morado.startingX = 26;
		morado.startingY = 20;
		morado.x = morado.startingX * game.spriteWidth;
		morado.y = morado.startingY * game.spriteHeight;
		morado.direction = 0;
		morado.xMovement = 0;
		morado.yMovement = 0;
		morado.walk = 0;
		morado.frame = morado.spriteOffset + morado.direction; 
	}

	var setBlue = function() {
		if (!blue) {
			blue = new Enemy(game.spriteWidth, game.spriteHeight);
			blue.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			blue.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
		}

		blue.isMoving = false;
		blue.requestedDirection = -1;
		blue.requestedXMovement = 0;
		blue.requestedYMovement = 0;
		blue.spriteOffset = 112;
		blue.originalSpriteOffset = blue.spriteOffset;
		blue.startingX = 26;
		blue.startingY = 1;
		blue.x = blue.startingX * game.spriteWidth;
		blue.y = blue.startingY * game.spriteHeight;
		blue.direction = 0;
		blue.xMovement = 0;
		blue.yMovement = 0;
		blue.walk = 0;
		blue.frame = blue.spriteOffset + blue.direction; 
	}

	var setScore = function() {
		if (!scoreLabel) {
			scoreLabel = new Label();
			scoreLabel.font = "italic bold 30px sans-serif";
			scoreLabel.color = '#ffffff';
			scoreLabel.x = 0;
			scoreLabel.y = 500;
			scoreLabel.textAlign = 'left';
		}

		scoreLabel.text = "Score: " + score;
	}

	var setLevel = function() {
		if (!levelLabel) {		
			levelLabel = new Label();
			levelLabel.font = "italic bold 30px sans-serif";
			levelLabel.color = "#ffffff";
			levelLabel.x = 350;
			levelLabel.y = 500;
			levelLabel.textAlign = 'left';
		}
		levelLabel.text = "Level: " + level;
	}

	var setYellow = function() {
		if (!yellow) {
			yellow = new Enemy(game.spriteWidth, game.spriteHeight);
			yellow.image = new Surface(game.spriteSheetWidth, game.spriteSheetHeight);
			yellow.image.draw(game.assets['assets/enchant/images/pacmanSprites.gif']);
		}

		yellow.isMoving = false;
		yellow.requestedDirection = 0;
		yellow.requestedXMovement = 0;
		yellow.requestedYMovement = 0;
		yellow.spriteOffset = 128;
		yellow.originalSpriteOffset = yellow.spriteOffset;
		yellow.startingX = 2;
		yellow.startingY = 1;
		yellow.x = yellow.startingX * game.spriteWidth;
		yellow.y = yellow.startingY * game.spriteHeight;
		yellow.xMovement = 0;
		yellow.yMovement = 0;
		yellow.direction = 0;
		yellow.walk = 0;
		yellow.frame = yellow.spriteOffset + yellow.direction; 
	}

	var showMessageAndWaitForKey = function(scene, x, y, message, callback) {
		var label = new Label(message);
		label.font = "italic bold 40px sans-serif";
		label.color = "#ffffff";
		label.textAlign = 'left';

		var metrics = label.getMetrics(message);
		if (x) {
			label.x = x;
		} else {
			label.x = (game.width/2) - (metrics.width/2);
		}

		if (y) {
			label.y = y;
		} else {
			label.y = (game.height/2) - (metrics.height/2);
		}

		scene.on(Event.ENTER_FRAME, function() {
			if (label.age>(0.5*game.fps) && (game.input.left || game.input.right || game.input.up || game.input.down)) {
				scene.clearEventListener(Event.ENTER_FRAME);

				label.selectedAge = label.age;
				label.on(Event.ENTER_FRAME, function() {
					label.opacity=Math.sin(label.age*0.2);
					if ((label.age - label.selectedAge)>(game.fps<<1)) {
						label.clearEventListener(Event.ENTER_FRAME);
						
						scene.removeChild(label);
						callback();
					}
				})
			}
		});

		scene.addChild(label);
	}

	var setStage = function(){
		setMaps();
		setPlayer();
		setPinky();
		setMorado();
		setBlue();
		setYellow();
		setScore();
		setLevel();

		if (sceneBoard==null) {
			var stage = new Group();
			stage.addChild(map);
			stage.addChild(pillsandpowerups);
			stage.addChild(player);
			stage.addChild(pinky);
			stage.addChild(morado);
			stage.addChild(blue);
			stage.addChild(yellow);

			sceneBoard = new Scene();
			sceneBoard.addChild(stage);
			sceneBoard.addChild(scoreLabel);
			sceneBoard.addChild(levelLabel);

			sceneBoard.on(enchant.Event.EXIT, function() {
				player.clearEventListener(enchant.Event.ENTER_FRAME);
				yellow.clearEventListener(enchant.Event.ENTER_FRAME);
				pinky.clearEventListener(enchant.Event.ENTER_FRAME);
				morado.clearEventListener(enchant.Event.ENTER_FRAME);
				blue.clearEventListener(enchant.Event.ENTER_FRAME);
				sceneBoard.clearEventListener(enchant.Event.TOUCH_END);
			});
	
			sceneBoard.on(enchant.Event.ENTER, function() {
				setMaps();
				setScore();
				setLevel();
				setPlayer();
				setPinky();
				setMorado();
				setBlue();
				setYellow();


				showMessageAndWaitForKey(this, null, 210, "Ready!", function() {
					player.on(enchant.Event.ENTER_FRAME, function() {
						player.move();
					});

					yellow.on(enchant.Event.ENTER_FRAME, function() {
						yellow.move(player, map, game);
						if (yellow.within(player, 8)) {
							if (!yellow.isVulnerable) {
								player.loseLife();

							} else {
								yellow.ghostEaten();
							}
						}	
					});

					pinky.on(enchant.Event.ENTER_FRAME, function() {
						pinky.move(player, map, game);
						if (pinky.within(player, 8)) {
							if (!pinky.isVulnerable) {
								player.loseLife();

							} else {
								pinky.ghostEaten();
							}
						}
					});

					morado.on(enchant.Event.ENTER_FRAME, function() {
						morado.move(player, map, game);
						if (morado.within(player, 8)) {
							if (!morado.isVulnerable) {
								player.loseLife();
								
							} else {
								morado.ghostEaten();
							}
						}
					});

					blue.on(enchant.Event.ENTER_FRAME, function() {
						blue.move(player, map, game);
						if (blue.within(player, 8)) {
							if (!blue.isVulnerable) {
								player.loseLife();
								
							} else {
								blue.ghostEaten();
							}
						}
					});
				});
		    });
		}

		game.replaceScene(sceneBoard);

	};

	var setNextLevel = function() {
		requestStartLevel = false;
		level++;
		pillscollected = 0;
		ghostsEat = 0;
		powerUpsCollected = 0;

		setStage();
	}

	var setGameOver = function() {
		if (sceneGameOver==null) {
			var gameOverLabel = new Label("Game Over!");
			gameOverLabel.font = "italic bold 40px sans-serif";
			gameOverLabel.color = "#ffffff";
			gameOverLabel.y = 200;
			gameOverLabel.x = 200;
			var metrics = gameOverLabel.getMetrics(gameOverLabel.text);
			gameOverLabel.x = (game.width/2) - (metrics.width / 2);
			gameOverLabel.y = (game.height/2) - (metrics.height / 2);

			var stage = new Group();
			stage.addChild(gameOverLabel);

			sceneGameOver = new Scene();
			sceneGameOver.addChild(stage);
		}

		sceneGameOver.on(Event.ENTER_FRAME, function() {
			if (game.input.left || game.input.right || game.input.down || game.input.up) {
				sceneGameOver.clearEventListener(Event.ENTER_FRAME);

				window.setTimeout(function() { setStartGame(); }, 1000);
			}
		});

		game.replaceScene(sceneGameOver);
	}

	game.onload = function(){
		setStartGame();
	};

	var setStartGame = function() {
 		startTime = (new Date).getTime();
		lifes = maxLifes;
		level = 1;
		score = 0;
		
		setStage();
	}

	game.start();
};
