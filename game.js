// game.js
import Sprite from './sprites.js'; 

document.addEventListener("DOMContentLoaded", function () {
  var gameCanvas = document.getElementById("gameCanvas");
  var sprites = []; // Define the sprites array here
            var fireballButton = document.getElementById("fireballButton");
            var gustButton = document.getElementById("gustButton");

            var sprites = [];

            var gust;
            var fireball;
            var isFireballActive = false;
            var isGustActive = false;

            gameCanvas.addEventListener("click", function (event) {
                var x = event.clientX;
                var y = event.clientY;
                moveManTo(x, y);
            });

            

           
             // Instantiate man and man2 sprites, passing the gameCanvas and sprites array
  var man = new Sprite("man", "man.png", 200, 200, gameCanvas);
  var man2 = new Sprite("man2", "man2.png", 400, 400, gameCanvas);

            // Start roaming as soon as man2 is created
            roamMan2(man2);

            // This function is called when man2's health drops to 0
            var man2Count = 1; // New variable to keep track of the number of man2 elements

            function checkCollision(sprite1, sprite2) {
                var rect1 = sprite1.getBoundingClientRect();
                var rect2 = sprite2.getBoundingClientRect();

                return !(rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom);
            }

            function checkManCollision() {
                var manEl = man.container;

                for (var i = 0; i < sprites.length; i++) {
                    if (sprites[i].name !== 'man' && checkCollision(manEl, sprites[i].container)) {
                        man.damage(20);
                        if (man.healthValue <= 0) {
                            var gameOverScreen = document.getElementById('gameOverScreen');
                            gameOverScreen.style.display = 'flex';
                        }
                        return;
                    }
                }

                setTimeout(checkManCollision, 100);
            }

            function spawnNewMan2() {
                for (var i = 0; i < 2; i++) {
                    var newMan2Name = "man2" + man2Count;

                    // Create a new sprite container for the new sprite
                    var newMan2Container = document.createElement('div');
                    newMan2Container.className = newMan2Name + "Container spriteContainer";

                    // Create a new sprite image for the new sprite
                    var newMan2Img = document.createElement('img');
                    newMan2Img.className = newMan2Name + " sprite";
                    newMan2Img.src = "man2.png";
                    newMan2Container.appendChild(newMan2Img);

                    // Create a new health bar for the new sprite
                    var newMan2Health = document.createElement('div');
                    newMan2Health.className = newMan2Name + "Health healthBar";
                    newMan2Container.appendChild(newMan2Health);

                    // Append the new sprite container to the game canvas
                    gameCanvas.appendChild(newMan2Container);

                    var newMan2 = new Sprite(
                        newMan2Name,
                        "man2.png",
                        Math.random() * gameCanvas.offsetWidth,
                        Math.random() * gameCanvas.offsetHeight
                    );

                    roamMan2(newMan2); // Call the roamMan2 function to make the new man2 sprite start moving randomly
                    man2Count++; // Increment the man2 counter
                }
            }

            // Add this just after the man is instantiated
            checkManCollision(); // Function to handle the gust wind action
            function gustWind() {
                if (isGustActive) {
                    return;
                }
                gust = document.createElement("div");
                gust.classList.add("gust");
                gust.style.left = man.container.style.left;
                gust.style.top = man.container.style.top;
                gameCanvas.appendChild(gust);
                isGustActive = true;
                setTimeout(function () {
                    sprites.forEach(function (sprite) {
                        if (sprite.name !== 'man' && checkCollision(sprite.container, gust)) {
                            sprite.damage(10);
                        }
                    });
                    if (gust.parentElement != null) {
                        gust.remove();
                    }
                    isGustActive = false;
                }, 1000);
            }

            function moveFireballTo(x, y) {
                var dx = x - parseInt(fireball.style.left);
                var dy = y - parseInt(fireball.style.top);
                var distance = Math.sqrt(dx * dx + dy * dy);
                var speed = 5; // Adjust this value to change the speed of the fireball
                var duration = distance / speed; // Calculate the duration based on speed
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = timestamp - startTime;

                    if (progress >= duration) {
                        fireball.style.display = 'none';
                        isFireballActive = false;
                    } else {
                        var ratio = progress / duration;
                        var newX = parseFloat(fireball.style.left) + dx * ratio;
                        var newY = parseFloat(fireball.style.top) + dy * ratio;
                        fireball.style.left = newX + 'px';
fireball.style.top = newY + 'px';
fireball.style.display = 'block'; // Add this line to show the fireball
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);
            }

            // Function to handle the fireball action
            function fireballAttack(x, y) {
                if (isFireballActive) {
                    return;
                }

                fireball = document.createElement("div");
                fireball.classList.add("fireball");
                fireball.style.backgroundImage = "url('fireball.jpeg')";
                fireball.style.backgroundSize = "cover";
                fireball.style.width = "45px";
                fireball.style.height = "45px";
                fireball.style.position = "absolute";
                fireball.style.left = man.container.style.left;
                fireball.style.top = man.container.style.top;
                gameCanvas.appendChild(fireball);
                isFireballActive = true;

                var startPosX = parseInt(man.container.style.left);
			    var startPosY = parseInt(man.container.style.top);

                var dx = x - startPosX;
                var dy = y - startPosY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var speed = 5; // Adjust this value to change the speed of the fireball

                var duration = distance / speed; // Calculate the duration based on speed

                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var elapsed = timestamp - startTime;
                    var progress = elapsed / (duration * 1000);

                    if (progress >= 1) {
                        fireball.style.left = newX + 'px';
fireball.style.top = newY + 'px';
fireball.style.display = 'block'; // Add this line to show the fireball

                        sprites.forEach(function (sprite) {
                            if (sprite.name !== 'man' && checkCollision(sprite.container, fireball)) {
                                sprite.damage(20);
                            }
                        });

                        if (fireball.parentElement != null) {
                            fireball.remove();
                        }

                        isFireballActive = false;
                    } else {
                        var newX = startPosX + dx * progress;
                        var newY = startPosY + dy * progress;
                        fireball.style.left = newX + 'px';
fireball.style.top = newY + 'px';
fireball.style.display = 'block'; // Add this line to show the fireball
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);
            }

            // Function to check for collisions between all sprites and damage them
            function checkForCollisions() {
                for (var i = 0; i < sprites.length; i++) {
                    for (var j = i + 1; j < sprites.length; j++) {
                        if (checkCollision(sprites[i].container, sprites[j].container)) {
                            sprites[i].damage(1); // Adjust the damage value as needed
                            sprites[j].damage(1); // Adjust the damage value as needed
                        }
                    }
                }
                setTimeout(checkForCollisions, 1000); // Call this function every second
            }

            // Call the function to start checking for collisions
            checkForCollisions();

            // Event listener for gust button
            gustButton.addEventListener("click", function () {
                gustWind();
            });

            // Event listener for fireball button
            fireballButton.addEventListener("click", function (event) {
                event.stopPropagation();
                var rect = gameCanvas.getBoundingClientRect();
                var x = event.clientX - rect.left - 22.5; // Adjust the value by half the fireball width
                var y = event.clientY - rect.top - 22.5; // Adjust the value by half the fireball height
                fireballAttack(x, y);
            });

            // Event listener for keyboard keys
            document.addEventListener("keydown", function (event) {
                if (event.code === "Digit1") {
                    fireballAttack();
                } else if (event.code === "Digit2") {
                    gustWind();
                }
            });

            // Function to move the man sprite to the specified coordinates
            function moveManTo(x, y) {
                var dx = x - man.container.offsetLeft;
                var dy = y - man.container.offsetTop;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var speed = 3; // Set the walking speed
                var duration = distance / speed; // Calculate the duration based on speed
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = timestamp - startTime;

                    if (progress >= duration) {
                        man.move(x, y); // Move the man to the final position
                    } else {
                        var ratio = progress / duration;
                        var newX = man.container.offsetLeft + dx * ratio;
                        var newY = man.container.offsetTop + dy * ratio;
                        man.move(newX, newY);
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);
            }

            function moveMan2To(man2, x, y) {
                var dx = x - parseFloat(man2.container.style.left);
                var dy = y - parseFloat(man2.container.style.top);
                var distance = Math.sqrt(dx * dx + dy * dy);
                var speed = 3; // Adjust this value to change the speed of movement
                var duration = distance / speed; // Calculate the duration based on speed
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = timestamp - startTime;

                    if (progress >= duration) {
                        man2.move(x, y); // Move the man2 to the final position
                        roamMan2(man2); // Call the roamMan2 function after reaching the destination
                    } else {
                        var ratio = progress / duration;
                        var newX = parseFloat(man2.container.style.left) + dx * ratio;
                        var newY = parseFloat(man2.container.style.top) + dy * ratio;
                        man2.move(newX, newY);
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);
            }

            // Function to make man2 roam randomly
            function roamMan2(man2) {
                var x = Math.random() * gameCanvas.offsetWidth;
                var y = Math.random() * gameCanvas.offsetHeight;
                moveMan2To(man2, x, y);
            }
});