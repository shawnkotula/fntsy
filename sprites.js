// sprites.js

var sprites = [];

function Sprite(name, imageName, x, y, gameCanvas) {
  this.name = name;
  this.container = gameCanvas.querySelector("." + name + "Container");
  this.health = this.container.querySelector("." + name + "Health");

  this.healthValue = 100;

  this.damage = function (damageValue) {
    if (this.healthValue <= 0) return;
    this.healthValue -= damageValue;
    this.health.style.width = this.healthValue + "%";
    if (this.healthValue <= 0) {
      this.container.remove();
      var spriteIndex = sprites.indexOf(this);
      if (spriteIndex > -1) {
        sprites.splice(spriteIndex, 1);
      }

      if (this.name.startsWith("man2")) {
        spawnNewMan2();
      }
    }
  };

  this.move = function (x, y) {
    this.container.style.top = y - this.container.offsetHeight / 2 + "px";
    this.container.style.left = x - this.container.offsetWidth / 2 + "px";
  };

  this.moveRandomly = function () {
    var x = Math.random() * gameCanvas.offsetWidth;
    var y = Math.random() * gameCanvas.offsetHeight;
    this.move(x, y);
  };

  this.move(x, y); // Actually move sprite on initialization

  // Add sprite to the sprites array
  sprites.push(this);
}

export default Sprite;