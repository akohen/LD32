var menuState = {
  preload: function () {
    game.load.image('background', 'assets/screenLevel.png');
  },


  create: function () {
    game.add.sprite(0,0, 'background');
    cursors = game.input.keyboard.createCursorKeys();
  },


  update: function() {
    if (cursors.up.isDown) {
        game.state.start('game');
      } 
  },

}


var gameOverState = {
  preload: function () {
    game.load.image('background', 'assets/screenGameOver.png');
  },
  create: function () {
    game.add.sprite(0,0, 'background');
    cursors = game.input.keyboard.createCursorKeys();
  },
  update: function() {
    if (cursors.up.isDown) {
        game.state.start('menu');
      } 
  },

}

var gameState = {

  levels : {
    level1 :    { speed : 200, speedVar : 50, spawnTime : 50, spawnTimeVar : 0, duration : 2, background : 'screenGeography', next : 'level2'},
    level2 :    { speed : 200, speedVar : 50, spawnTime : 50, spawnTimeVar : 30, duration : 4, background : 'screenLanguage', next : 'level3'},
    level3 :    { speed : 400, speedVar : 50, spawnTime : 10, spawnTimeVar : 30, duration : 8, background : 'screenScience', next : 'level1'},
    punition :  { speed : 100, speedVar : 0, spawnTime : 100, spawnTimeVar : 0, duration : 2, background : 'screenLevel', next : 'punition'},
  },

  preload: function () {
    game.load.image('arrow', 'assets/arrow_up2.png');
    game.load.image('arrowUp', 'assets/arrow_up2.png');
    game.load.image('arrowDown', 'assets/arrow_down2.png');
    game.load.image('arrowRight', 'assets/arrow_right2.png');
    game.load.image('arrowLeft', 'assets/arrow_left2.png');
    game.load.image('curseur', 'assets/pen.png');
    game.load.audio('pickup', 'assets/pickup.wav');
    game.load.image('screenLevel', 'assets/screenLevel.png');
    game.load.image('screenGeography', 'assets/screenGeography.png');
    game.load.image('screenLanguage', 'assets/screenLanguage.png');
    game.load.image('screenScience', 'assets/screenScience.png');
  },

  loadLevel: function(name) {
    console.log('Loading level ' + name);
    if( name != 'punition' ) {
      currentLevel = name;
    }
    score = 0;
    spawnTimer = 0;
    cooldown = 0;
    level = this.levels[name];
    arrows.removeAll();
    state = 'playing';
    resultDisplay.kill();
    player.revive();
    background.loadTexture(level.background);
  },

  displayResult: function() {
    result = score / level.duration;
    if( result < 0.5 ) { // Lose
      game.state.start('gameOver');
    } else { // Show results
      if( result >= 0.9) {
        grade = 'A';
      } else if( result >= 0.8 ) {
        grade = 'B';
      } else if( result >= 0.7 ) {
        grade = 'C';
      } else if( result >= 0.6 ) {
        grade = 'D';
      } else {
        grade = 'E';
      }
      player.kill();
      background.loadTexture('screenLevel');
      resultDisplay.text = 'Résultat ' + grade;
      resultDisplay.revive();
      game.time.events.add(Phaser.Timer.SECOND * 2, this.loadNextLevel, this);
    }

  },

  loadNextLevel: function() {
    if( result >= 0.80 && level.next != 'punition') { // Punition
      this.loadLevel('punition');
    } else if( level.next == 'end' ) { // Win
      game.state.start('menu');
    } else {
      this.loadLevel(this.levels[currentLevel].next);
    } 
  },


  create: function () {
    background = game.add.image(0,0, 'screenLevel');
    background.loadTexture('screenScience');

    resultDisplay = game.add.text(320, 300, '',  { font: "40px Arial", fill: '#ff2222'});

    arrows = game.add.group();
    arrows.physicsEnabled = true
    arrows.enableBody = true;
    arrows.physicsBodyType = Phaser.Physics.ARCADE;

    player = game.add.sprite(100,250, 'curseur');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.body.width = 2;
    player.body.height = 120;

    cursors = game.input.keyboard.createCursorKeys();

    pickupSound = game.add.audio('pickup');

    this.loadLevel('level1');
  },


  update: function() {
    this.updateCursor();
    this.spawnArrow();
    
    game.physics.arcade.overlap(player, arrows, this.collisionHandler, null, this);
  },


  spawnArrow: function() {
    if( arrows.length < level.duration ) {
      
      if (spawnTimer == 0) {
        arrowChoice = Math.floor( Math.random()*3.999);
        if (arrowChoice == 0){
          arrowType = 'arrowUp';
        } else if (arrowChoice == 1 ) {
          arrowType = 'arrowDown';
        } else if (arrowChoice == 2 ){
          arrowType = 'arrowRight';
        } else if (arrowChoice == 3 ){
          arrowType = 'arrowLeft';
        } else {
          arrowType = 'arrow';
        }

        var arrow = arrows.create(750, 300, arrowType);
        arrow.body.velocity.x = - level.speed + Math.random() * level.speedVar;
        spawnTimer = Math.floor(level.spawnTime + Math.random()*level.spawnTimeVar);
      }
      spawnTimer--;
    } else if( arrows.getBounds().x + arrows.getBounds().width <= 0 && state == 'playing') {
      state = 'ending';
      this.displayResult();
    }
  },

  updateCursor: function() {
    key = '';
    if( cooldown == 0 ) {
      if (cursors.up.isDown) {
        key = 'Up';
      } else if (cursors.down.isDown) {
        key = 'Down';
      } else if (cursors.left.isDown) {
        key = 'Left';
      } else if (cursors.right.isDown) {
        key = 'Right';
      }
      if( key != '' ) {
        cooldown = 10;
      }
    } else {
      cooldown--;
    }
  },


  collisionHandler: function(player, arrow) {
    if( key != '' ) {
      if( 'arrow'+key == arrow.key) {
        arrow.kill();
        score += 1;
        pickupSound.play();
        console.log("Score : " + score);
      }
    }
  }
  
}


var game = new Phaser.Game(800, 600);
game.state.add('game', gameState);
game.state.add('gameOver', gameOverState);
game.state.add('menu', menuState, true);