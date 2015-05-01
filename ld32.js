var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var cursors;
var key;
var cooldown = 0;
var arrows;
var player;
var apparitionTime;
var speed = -300;
var apparitionTimeLow = 10;
var apparitionTimeHigh = 150;

var arrowType;
var arrowChoise;


function preload () {
  game.load.image('arrow', 'assets/arrow_up2.png');
  game.load.image('arrowUp', 'assets/arrow_up2.png');
  game.load.image('arrowDown', 'assets/arrow_down2.png');
  game.load.image('arrowRight', 'assets/arrow_right2.png');
  game.load.image('arrowLeft', 'assets/arrow_left2.png');
  game.load.image('curseur', 'assets/arrow_up.png');
}


function create () {
  game.time.advancedTiming = true;

  arrows = game.add.group();
  arrows.physicsEnabled = true
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;

  player = game.add.sprite(100,250, 'curseur');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  cursors = game.input.keyboard.createCursorKeys();
  apparitionTime = 10;
}


function update() {
  updateCursor();
  spawnArrow();
  
  game.physics.arcade.overlap(player, arrows, collisionHandler, null, this);
}


function spawnArrow() {
  if (apparitionTime == 0) {
    arrowChoise = Math.floor( Math.random()*3.999);
    if (arrowChoise == 0){
      arrowType = 'arrowUp';
    } else if (arrowChoise == 1 ) {
      arrowType = 'arrowDown';
    } else if (arrowChoise == 2 ){
      arrowType = 'arrowRight';
    } else if (arrowChoise == 3 ){
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
      cooldown = 15;
    }
  } else {
    cooldown--;
  }
}


function collisionHandler(player, arrow) {
  if( key != '' ) {
    if( 'arrow'+key == arrow.key) {
      arrow.kill();
      console.log('OK!');
    } else {
      console.log('NON');
    }
  }

}


function goodbye(obj) {
   obj.kill();
}