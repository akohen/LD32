var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var key;
var cooldown;
var arrows;
var player;
var apparitionTime;
var speed = -100;
var apparitionTimeLow = 10;
var apparitionTimeHigh = 150;

function preload () {
  game.load.image('arrow', 'assets/arrow_up.png');
  game.load.image('arrowDown', 'assets/arrow_down.png');
}


function create () {
  arrows = game.add.group();
  arrows.physicsEnabled = true
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;

  arrows.create(400, 300, 'arrow');
  arrows.create(500, 300, 'arrow');
  arrows.create(600, 300, 'arrow');

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
  	arrows.create(750, 300, 'arrow').body.velocity.x = speed;
  	apparitionTime = Math.floor(apparitionTimeLow + Math.random()*(apparitionTimeHigh - apparitionTimeLow));
  }
  
  apparitionTime-- ;

}

function updateCursor() {
  if (cursors.up.isDown) {
    console.log('up');
  } else if (cursors.down.isDown) {
    console.log('down');
  } else if (cursors.left.isDown) {
    console.log('left');
  } else if (cursors.right.isDown) {
    console.log('right');
  }

}

function collisionHandler(player, arrow) {
  console.log('test');
}