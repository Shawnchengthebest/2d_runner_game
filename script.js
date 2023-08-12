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
                    this.game.Player.shootTop();
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
            this.ammo = 20;
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
            context.fillStyle = 'red'
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(p => p.draw(context));
        }
        shootTop(){
            // create porjecticle
            if (this.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + this.width, this.y));
                this.ammo -= 1;
            }
          
            
        }
    }
    class Enemy {

    }
    class layer {

    }
    class Background {

    }
    class UI {

    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.Player = new Player(this);
            this.keys = [];
            this.input = new InputHandler(this);
        }
        update(){
            this.Player.update();
        }
        draw(context){
            this.Player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);    
    //animate loop
    let lastTime = 0;
    function animate(timeStamp){
        // delta time 
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        console.log(deltaTime);
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx);
        game.update();
        requestAnimationFrame(animate); 
    }
    animate(0);
});

