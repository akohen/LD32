var menuState = {
  preload: function () {
    game.load.image('background', 'assets/screenLevel.png');

    game.load.image('arrow', 'assets/arrow_up2.png');
    game.load.image('arrowUp', 'assets/arrow_up2.png');
    game.load.image('arrowDown', 'assets/arrow_down2.png');
    game.load.image('arrowRight', 'assets/arrow_right2.png');
    game.load.image('arrowLeft', 'assets/arrow_left2.png');
    game.load.image('curseur', 'assets/pen.png');
    game.load.image('screenResult', 'assets/screenLevel.png');
    game.load.image('screenGeography', 'assets/screenGeography.png');
    game.load.image('screenLanguage', 'assets/screenLanguage.png');
    game.load.image('screenScience', 'assets/screenScience.png');
    game.load.image('screenSport', 'assets/screenSport.png');
    game.load.image('screenPunition', 'assets/screenPunition.png');

    game.load.image('gameOver', 'assets/screenGameOver.png');
    game.load.image('end', 'assets/screenEnd.png');

    game.load.audio('pickup', 'assets/pickup.wav');
    game.load.audio('soundNote', 'assets/soundNote.mp3');

    game.load.audio('soundGeography', 'assets/soundGeography.mp3');
    game.load.audio('soundLanguage', 'assets/soundLanguage.mp3');
    game.load.audio('soundPunition', 'assets/soundPunition.mp3');
    game.load.audio('soundScience', 'assets/soundScience.mp3');
    game.load.audio('soundSport', 'assets/soundSport.mp3');
  },


  create: function () {
    game.add.sprite(0,0, 'background');

    game.add.text(50, 300, 'P The Sloth has to take his exams.\nHe must pass every class while working as little as possible.\nMoreover, if his grades are too good, he\'ll have to sit in a student council session.\nSo tiring!', 
     { font: "20px Arial", fill: '#000000'});

    game.add.text(250, 450, 'Press any key to start', { font: "italic 26px Arial", fill: '#000000'});
    game.input.keyboard.onDownCallback = function(e) {
      game.state.start('game');
      game.input.keyboard.onDownCallback = null;
    }
  },

}


var gameOverState = {
  create: function () {
    game.add.sprite(0,0, 'gameOver');
    game.add.text(250, 450, 'Press any key', { font: "italic 26px Arial", fill: '#000000'});
    game.input.keyboard.onDownCallback = function(e) {
      game.state.start('menu');
      game.input.keyboard.onDownCallback = null;
    }
  },
}


var winState = {
  create: function () {
    game.add.sprite(0,0, 'end');
    cursors = game.input.keyboard.createCursorKeys();
    game.add.text(80, 310, 'Geography',  { font: "40px Arial", fill: '#000000'});
    game.add.text(360, 310, levels['geography'].grade,  { font: "40px Arial", fill: '#000000'});

    game.add.text(80, 360, 'Language',  { font: "40px Arial", fill: '#000000'});
    game.add.text(360, 360, levels['language'].grade,  { font: "40px Arial", fill: '#000000'});

    game.add.text(80, 410, 'Science',  { font: "40px Arial", fill: '#000000'});
    game.add.text(360, 410, levels['science'].grade,  { font: "40px Arial", fill: '#000000'});

    game.add.text(80, 460, 'Sport',  { font: "40px Arial", fill: '#000000'});
    game.add.text(360, 460, levels['sport'].grade,  { font: "40px Arial", fill: '#000000'});

    game.input.keyboard.onDownCallback = function(e) {
      game.state.start('menu');
      game.input.keyboard.onDownCallback = null;
    }
  },
}
    

var gameState = {

  create: function () {
    background = game.add.image(0,0, 'screenResult');
    background.loadTexture('screenScience');

    resultDisplay = game.add.text(375, 350, '',  { font: "40px Arial", fill: '#222222'});
    gradeDisplay = game.add.text(520, 340, '',  { font: "56px Arial", fill: '#ff2222'});

    arrows = game.add.group();
    arrows.physicsEnabled = true
    arrows.enableBody = true;
    arrows.physicsBodyType = Phaser.Physics.ARCADE;

    player = game.add.sprite(100,250, 'curseur');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.body.width = 5;
    player.body.height = 120;

    cursors = game.input.keyboard.createCursorKeys();

    pickupSound = game.add.audio('pickup');
    resultSound = game.add.audio('soundNote');

    levels = {
      geography : { name: 'geography',  speed : 200, speedVar : 0, spawnTime : 30, spawnTimeVar : 15, duration : 20,    background : 'screenGeography', music : game.add.audio('soundGeography'), next : 'language'},
      language :  { name: 'language',   speed : 300, speedVar : 25, spawnTime : 10, spawnTimeVar : 40, duration : 30,   background : 'screenLanguage',  music : game.add.audio('soundLanguage'), next : 'science'},
      science :   { name: 'science',    speed : 470, speedVar : 0, spawnTime : 3, spawnTimeVar : 40, duration : 40,     background : 'screenScience',   music : game.add.audio('soundScience'), next : 'sport'},
      sport :     { name: 'sport',      speed : 350, speedVar : 100, spawnTime : 20, spawnTimeVar : 10, duration : 40,  background : 'screenSport',     music : game.add.audio('soundSport'), next : 'win'},
      punition :  { name: 'punition',   speed : 150, speedVar : 0, spawnTime : 150, spawnTimeVar : 0, duration : 10,    background : 'screenPunition',  music : game.add.audio('soundPunition'), next : 'punition'},
    };

    this.loadLevel('geography');
  },

  loadLevel: function(name) {
    console.log('Loading level ' + name);
    if( name != 'punition' ) {
      currentLevel = name;
    }
    score = 0;
    spawnTimer = 0;
    cooldown = 0;
    level = levels[name];
    arrows.removeAll();
    state = 'playing';
    resultDisplay.kill();
    gradeDisplay.kill();
    player.revive();
    background.loadTexture(level.background);
    level.music.play();
  },

  displayResult: function() {
    result = score / level.duration;
    if( result >= 0.9) {
      grade = 'A';
    } else if( result >= 0.8 ) {
      grade = 'B';
    } else if( result >= 0.7 ) {
      grade = 'C';
    } else if( result >= 0.6 ) {
      grade = 'D';
    } else if( result >= 0.5 ) {
      grade = 'E';
    } else {
      grade = 'F';
    }
    level.grade = grade;
    level.music.stop();
    player.kill();
    background.loadTexture('screenResult');
    resultDisplay.text = 'Grade';
    resultDisplay.revive();
    resultSound.play();
    game.time.events.add(Phaser.Timer.SECOND * 3, this.showGrade, this);
    game.time.events.add(Phaser.Timer.SECOND * 4.5, this.loadNextLevel, this);
    

  },

  showGrade: function() {
    gradeDisplay.text = grade;
    gradeDisplay.revive();
  },

  loadNextLevel: function() {
    if( result < 0.5 ) { // Lose
      background.loadTexture('gameOver');
      resultDisplay.kill();
      gradeDisplay.kill();
      game.input.keyboard.onDownCallback = function(e) {
        game.input.keyboard.onDownCallback = null;
        gameState.loadLevel(level.name);
      }
    } else if( result >= 0.80 && level.next != 'punition') { // Punition
      this.loadLevel('punition');
    } else if( level.next == 'win' ) { // Win
      game.state.start('win');
    } else {
      this.loadLevel(levels[currentLevel].next);
    } 
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
        cooldown = 8;
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
      }
    }
  }
  
}


var game = new Phaser.Game(800, 600);
game.state.add('game', gameState);
game.state.add('gameOver', gameOverState);
game.state.add('win', winState);
game.state.add('menu', menuState, true);