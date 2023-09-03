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
                }
                console.log(this.game.keys);
            });
            window.addEventListener('keyup', e =>{
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                    console.log(this.game.keys)
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
            console.log(game);  
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 2;
            this.projectiles = []; 
            // this.ammo = 20;
        }
        update(){
            // change the speed of player based on the key arrow
            if (this.game.keys.includes('ArrowUp')) {
                // do somthing 
                this.speedY = -this.maxSpeed;
                console.log(this.speedY)
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speedY = this.maxSpeed;
                
            } else this.speedY = 0;
            
            this.y += this.speedY;

            // updating projecticles
            this.projectiles.forEach(p => p.update())

            // remove missle
            this.projectiles.filter(p => !p.markedForDeletion)
        }
        draw(context){
            context.fillStyle = 'blue'
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(p => p.draw(context));
        }
        shootTop(){
            // create porjecticle
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + this.width, this.y));
                this.game.ammo -= 1;
            }
          
            
        }
    }
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = game.width;
            // this.y = game.height;
            this.speedX = Math.random() * -1.5 -0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
        }
        update(){
            this.x += this.speedX;
            // mark ememy if it moves out the screen
            if (this.x + this.width < 0){
                this.markedForDeletion = true;
            }
        }
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height); //with,;heigth;provided by child class
            context.fillStyle = 'black'
            context.font = '20px Helvetca';
            context.fillText(this.lives, this.x, this.y)
        }
    }

    class Angeler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 228 * 0.2;
            this.height = 169 * 0.2;
            this.y = Math.random() * game.height * 0.9  - this.height;
        }
    }

    class layer {

    }
    class Background {

    }
    class UI {
        constructor(game){
            this.game = game
            this.fontSize = 25;
            this.fontFamily = 'helvetica';
            this.color = 'white';
        }
        draw(context){
            // ammo ui
            context.fillStyle = this.color
            console.log(this.game.ammo)
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20+ 7 * i, 50, 3, 20);
            }
        }

    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
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
        }
        update(deltaTime){
            this.player.update();
            if (this.ammoTimer > this.ammoInterval){
                if (this.ammo < this.maxAmmo) this.ammo++;
                // reset timer
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            // update enemies
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                 }
                this.player.projectiles.forEach(Projectile => {
                    if (this.checkCollision(Projectile, enemy)){
                        enemy.lives--;
                        Projectile.markedForDeletion = true;
                        if (enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            this.score+= enemy.score;
                        }
                    }
                });
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
            // console.log(this.enemies)
        }
        draw(context){
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
            this.enemies.push(new Angeler1(this));
        }
        checkCollision(rect1, rect2){
        return (    rect1.x < rect2.x + rect2.width &&
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

