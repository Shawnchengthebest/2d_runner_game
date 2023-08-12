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
                     (e.key === 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
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
        }
        update(){
            // change the speed of player based on the key arrow
            if (this.game.keys.includes('ArrowUp')) {
                // do somthing 
                this.speedY = -1;
                console.log(this.speedY)
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speedY = 1;
                
            }
            
            this.y += this.speedY;
        }
        draw(context){
            context.fillRect(this.x, this.y, this.width, this.height);
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
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.draw(ctx);
        game.update();
        requestAnimationFrame(animate); 
    }
    animate();
});

