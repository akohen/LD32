var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var arrows;

function preload () {
  game.load.image('arrow', 'assets/arrow_up.png');
}

function create () {
  arrows = game.add.group();
  arrows.physicsEnabled = true
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;

  arrows.create(400, 300, 'arrow');
  arrows.create(500, 300, 'arrow');
  arrows.create(600, 300, 'arrow');

  arrows.setAll('body.velocity.x', -25);
  console.log('test');
}

function update() {

}