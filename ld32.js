var gameState = {
  //key,
  cooldown : 0,
  //arrows,
  //player,
  apparitionTime : 10,
  speed : -300,
  apparitionTimeLow : 10,
  apparitionTimeHigh : 150,
  score : 0,
  //scoreText,
  //arrowType,
  //arrowChoice,


  preload: function () {
    game.load.image('arrow', 'assets/arrow_up2.png');
    game.load.image('arrowUp', 'assets/arrow_up2.png');
    game.load.image('arrowDown', 'assets/arrow_down2.png');
    game.load.image('arrowRight', 'assets/arrow_right2.png');
    game.load.image('arrowLeft', 'assets/arrow_left2.png');
    game.load.image('curseur', 'assets/curseur.png');
  },


  create: function () {
    this.arrows = game.add.group();
    this.arrows.physicsEnabled = true
    this.arrows.enableBody = true;
    this.arrows.physicsBodyType = Phaser.Physics.ARCADE;

    player = game.add.sprite(100,275, 'curseur');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.body.width=1;
    player.body.height = 60;

    scoreText = game.add.text(10, 10, 'Score : ' + this.score,  { font: "32px Arial", fill: '#ffffff'});

    this.cursors = game.input.keyboard.createCursorKeys();
  },


  update: function() {
    this.updateCursor();
    this.spawnArrow();
    
    game.physics.arcade.overlap(player, this.arrows, this.collisionHandler, null, this);
  },


  spawnArrow: function() {
    if (this.apparitionTime == 0) {
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

      var arrow = this.arrows.create(750, 300, arrowType);
      arrow.body.velocity.x = this.speed;
      arrow.events.onOutOfBounds.add(this.goodbye, this);
      arrow.checkWorldBounds = true;
      this.apparitionTime = Math.floor(this.apparitionTimeLow + Math.random()*(this.apparitionTimeHigh - this.apparitionTimeLow));
    }
    
    this.apparitionTime-- ;
  },


  updateCursor: function() {
    key = '';
    if( this.cooldown == 0 ) {
      if (this.cursors.up.isDown) {
        key = 'Up';
      } else if (this.cursors.down.isDown) {
        key = 'Down';
      } else if (this.cursors.left.isDown) {
        key = 'Left';
      } else if (this.cursors.right.isDown) {
        key = 'Right';
      }
      if( key != '' ) {
        console.log(key);
        this.cooldown = 15;
      }
    } else {
      this.cooldown--;
    }
  },


  collisionHandler: function(player, arrow) {
    if( key != '' ) {
      if( 'arrow'+key == arrow.key) {
        arrow.kill();
        this.score += 1;
        scoreText.text = "Score : " + this.score;
      }
    }

  },


  goodbye: function(obj) {
     obj.kill();
  }
}


var game = new Phaser.Game(800, 600);
game.state.add('menu', gameState, true);