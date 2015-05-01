var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

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
  game.load.image('arrow', 'assets/arrow_up.png');
  game.load.image('arrowUp', 'assets/arrow_up.png');
  game.load.image('arrowDown', 'assets/arrow_down.png');
  game.load.image('arrowRight', 'assets/arrow_right.png');
  game.load.image('arrowLeft', 'assets/arrow_left.png');
}


function create () {
  game.time.advancedTiming = true;

  arrows = game.add.group();
  arrows.physicsEnabled = true
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;

  arrows.setAll('body.velocity.x', speed);

  player = game.add.sprite(100,250, 'arrowDown');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  cursors = game.input.keyboard.createCursorKeys();
  apparitionTime = 10;
}


function update() {
  updateCursor();
  
  game.physics.arcade.overlap(player, arrows, collisionHandler, null, this);

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


function render() {
  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00"); 
}

function updateCursor() {
  key = '';
  if( cooldown == 0 ) {
    if (cursors.up.isDown) {
      key = 'up';
    } else if (cursors.down.isDown) {
      key = 'down';
    } else if (cursors.left.isDown) {
      key = 'left';
    } else if (cursors.right.isDown) {
      key = 'right';
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

}

function goodbye(obj) {
   obj.kill();
}