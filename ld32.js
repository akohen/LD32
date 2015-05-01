var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var cursors;
var key;
var cooldown = 0;
var arrows;
var player;
var apparitionTime = 10;
var speed = -300;
var spriteWidth = 60;
var apparitionTimeLow = -10 * 350 /speed ;
var apparitionTimeHigh = 3.5*apparitionTimeLow; //150;
var score = 0;
var scoreText;

var arrowType;
var arrowChoice;


function preload () {
  game.load.image('arrow', 'assets/arrow_up2.png');
  game.load.image('arrowUp', 'assets/arrow_up2.png');
  game.load.image('arrowDown', 'assets/arrow_down2.png');
  game.load.image('arrowRight', 'assets/arrow_right2.png');
  game.load.image('arrowLeft', 'assets/arrow_left2.png');
  game.load.image('curseur', 'assets/curseur.png');
}


function create () {
  arrows = game.add.group();
  arrows.physicsEnabled = true
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;

  player = game.add.sprite(100,275, 'curseur');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
  player.body.width=1;
  player.body.height = 60;

  scoreText = game.add.text(10, 10, 'Score : ' + score,  { font: "32px Arial", fill: '#ffffff'});

  cursors = game.input.keyboard.createCursorKeys();
}


function update() {
  updateCursor();
  spawnArrow();
  
  game.physics.arcade.overlap(player, arrows, collisionHandler, null, this);
}


function spawnArrow() {
  if (apparitionTime == 0) {
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
    arrow.body.velocity.x = speed;
    arrow.events.onOutOfBounds.add(goodbye, this);
    arrow.checkWorldBounds = true;
    apparitionTime = Math.floor(apparitionTimeLow + Math.random()*(apparitionTimeHigh - apparitionTimeLow));
  }
  
  apparitionTime-- ;
}


function updateCursor() {
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
      console.log(key);
      cooldown = 10;
    }
  } else {
    cooldown--;
  }
}


function collisionHandler(player, arrow) {
  if( key != '' ) {
    if( 'arrow'+key == arrow.key) {
      arrow.kill();
      score += 1;
      scoreText.text = "Score : " + score;
    }
  }

}


function goodbye(obj) {
   obj.kill();
}