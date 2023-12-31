window.addEventListener('load', function(){
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    //classes
    class InputHandler {
        constructor(game){
            this.game = game;
            // contruting the key array
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') ||
                     (e.key === 'ArrowDown')) 
                     && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }
            });
            window.addEventListener('keyup', e =>{
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
        }
    }
    class Projectile {
        //shooting thing
        constructor(game, x, y) {
            this.game = game;
            this.width = 10;
            this.height = 3;
            this.x = x;
            this.y = y;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            // make it moving
            this.x += this.speed;
            if (this.x > this.game.width * 0.9) {
                this.markedForDeletion = true;
            }
        }
        draw(context){
            context.fillStyle = 'green';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        
    }
    class Particle {
        
    }
    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrameX = 37;
            this.speedY = 0;
            this.maxSpeed = 2;
            this.projectiles = []; 
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpInterval  = 10000;

        

            // this.ammo = 20;
        }
        update(deltaTime){
            // change the speed of player based on the key arrow
            if (this.game.keys.includes('ArrowUp')) {
                // do somthing 
                this.speedY = -this.maxSpeed;
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speedY = this.maxSpeed;
                
            } else this.speedY = 0;
            
            this.y += this.speedY;

            // updating projecticles
            this.projectiles.forEach(p => p.update());

            // remove missle
            this.projectiles = this.projectiles.filter(p => (!p.markedForDeletion));
            
            //Sprite anamation
            if (this.frameX < this.maxFrameX) {
                this.frameX++;
            } else {
                this.frameX  = 0;
            }
            //Power up for lucky for the player when touched
            if (this.powerUp){
                if (this.powerUpTimer > this.powerUpInterval){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;

                }
            }
        }
        draw(context){
            this.projectiles.forEach(p => p.draw(context));
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);  
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);     
        }
        shootTop(){
            // create porjecticle
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo --;
            }
            if (this.powerUp) this.shootBottom();    
        }
        shootBottom(){
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
            }
        }

        enterPowerUp(){
            this.powerUpTimer = 0;
            this.powerUp = true;
            this.game.ammo = this.game.maxAmmo;
        }
    }
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = game.width;
            // this.y = game.height;
            this.speedX = Math.random() * -1.5 -0.5;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrameX = 37;
        }
        update(){
            this.x += this.speedX - this.game.speed;
            // mark ememy if it moves out the screen
            if (this.x + this.width < 0){
                this.markedForDeletion = true;
            }

            //Sprite anamation
            if (this.frameX < this.maxFrameX) {
                this.frameX++;
            } else {
                this.frameX  = 0;
            }
        }
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height); //with,;heigth;provided by child class
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);//this.image will be provided by child class
            context.font = '20px Helvetca';
            context.fillText(this.lives, this.x, this.y);
        }
    }

    class Angeler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 228;
            this.height = 169;
            this.frameY = Math.floor(Math.random() * 3);
            this.y = Math.random() * game.height * 0.9 - this.height;
            this.image = document.getElementById('angler1');
            this.lives = 2;
            this.score = this.lives;
        }
    }
    class Angeler2 extends Enemy {
        constructor(game){
            super(game);
            this.width = 213;
            this.height = 163;
            this.y = Math.random() * game.height * 0.9 - this.height;
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = this.lives;
        }
    }

    class LuckyFish extends Enemy {
        constructor(game){
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * game.height * 0.9 - this.height;
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky';
        }
    }

    class Layer {
        constructor(game, image, speedModfier){
            this.game = game;
            this.image = image;
            this.speedModfier = speedModfier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update(){
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModfier;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }
    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 1);
            this.layer2 = new Layer(this.game, this.image2, 1);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1);
            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
        }
        update(){
            this.layers.forEach(layer => layer.update());
        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }

    }
    class UI {
        constructor(game){
            this.game = game
            this.fontSize = 25;
            this.fontFamily = 'helvetica';
            this.color = 'white';
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffseY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px' + this.fontFamily;
            //score
            context.fillText('Score: ' + this.game.score, 20, 40);
            // ammo ui 
            if (this.game.player.powerUp) {
                context.fillStyle = '#ffffbd';}
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20+ 7 * i, 50, 3, 20);
            }
            // timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1)
            context.fillText('Timer: ' + formattedTime, 20, 100)
            // game over ms
            if (this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore){
                    message1 = 'You Win!';
                    message2 = 'Well Done!';
                } else {
                    message1 = 'You Lost';
                    message2 = 'Try Again Next time';
                }
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
            }
            context.restore();
        }

    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.ammo = 20;
            this.keys = [];
            this.enemies = [];
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 1000;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 200;
            this.gameTime = 0;
            this.timerlimit = 500000;
            this.speed = 1;
            this.debug = true;
        }
        update(deltaTime){
            // game timer
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timerlimit) this.gameOver = true;
            this.background.update();
            //update player (including projectiles)
            this.player.update(deltaTime);
            // console.log(this.player.projectiles.length);
            //update ammo 
            if (this.ammoTimer > this.ammoInterval){
                if (this.ammo < this.maxAmmo) this.ammo++;
                // reset timer
                this.ammoTimer = 0;
            } else {
                this .ammoTimer += deltaTime;
            }

            // update enemies
            this.enemies.forEach(enemy => {
                enemy.update();
                // check collison between player and enemy
                if (this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                    if (enemy.type == 'lucky') {
                        this.player.enterPowerUp();
                    } else {
                        this.score--;
                    }

                };

                // check collision for all projectiles and enemy 
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                    }
                });
                // console.log(this.player.projectiles)
                // mark enemy for deletion 
                if (enemy.lives <= 0){
                    enemy.markedForDeletion = true;
                   if (!this.gameOver) this.score+= enemy.score;
                   if (this.score > this.winningScore) this.gameOver = true;
                }
            });
    
            this.enemies = this.enemies.filter(enemy => (
                !enemy.markedForDeletion
            ));

            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            // draw all tpyes of enemmy
            this.enemies.forEach(
                enemy => {
                    enemy.draw(context);
                }
            )
        }
        addEnemy(){
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angeler1(this));
            else if (randomize < 0.6) this.enemies.push(new Angeler2(this));
            else this.enemies.push(new LuckyFish(this));
            
        }
        checkCollision(rect1, rect2){
        return (        rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.height + rect1.y > rect2.y)
            
        }
    }

    const game = new Game(canvas.width, canvas.height);    
    //animate loop
    let lastTime = 0;
    function animate(timeStamp){
        // delta time 
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);     
    }
    animate(0);
});

