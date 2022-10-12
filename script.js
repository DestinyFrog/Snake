const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const unit = 24;
const width = unit * 16;
const height = unit * 16;
var INGAME = false;const DELAY = 125;
var record = 0;

const deadSnake = new Image(120, 120);
deadSnake.src = "deadSnake.png";

function Grid(){
    let t = false;
    for(let j = 0; j < height/unit; j++){
        t = !t;
        for(let i = 0; i < width/unit; i++){
            if(t == false){
                context.fillStyle = "#000033";
            }else{
                context.fillStyle = "#000011";
            }
            t = !t;
            context.fillRect(i * unit,j * unit,unit,unit);
        }
    }
}
snake = {
    bodyParty: [],
    dir: {},
    draw: function(){
        let r = 0;
        let g = 255;
        let b = 0;
        this.bodyParty.map(p => {
            context.fillStyle = 'rgba('+r+','+g+','+b+')';
            context.fillRect(p.x*unit,p.y*unit,unit,unit);
        });
    },
    update: function(){
        for(let i = this.bodyParty.length - 1; i > 0; i--){
            this.bodyParty[i].x = this.bodyParty[i - 1].x;
            this.bodyParty[i].y = this.bodyParty[i - 1].y;
        }

        this.bodyParty[0].x += this.dir.x;
        this.bodyParty[0].y += this.dir.y; 

        if(this.bodyParty[0].x >= width/unit){
            this.bodyParty[0].x = 0;
        }
        if(this.bodyParty[0].x < 0){
            this.bodyParty[0].x = width/unit - 1;
        }
        if(this.bodyParty[0].y >= height/unit){
            this.bodyParty[0].y = 0;
        }
        if(this.bodyParty[0].y < 0){
            this.bodyParty[0].y = height/unit - 1;
        }

        let head = this.bodyParty[0];
        for(let j = 1; j < this.bodyParty.length; j++){
            if(head.x == this.bodyParty[j].x && head.y == this.bodyParty[j].y){
                INGAME = false;
            }
        }
    },
    grow: function(){
        let leng = this.bodyParty.length - 1;
        let last = this.bodyParty[leng];
        this.bodyParty.push({x: last.x + (this.dir.x * -1), y: last.y + (this.dir.y * -1)});
        let value = (leng+2).toString().padStart(4,'0');
        document.getElementById('counter').textContent = value;
    }
}
apple = {
    draw: function(){
        context.fillStyle = '#ff0000';
        context.beginPath();
        context.arc((this.x*unit)+unit/2,(this.y*unit)+unit/2,unit/2,0,Math.PI*2);
        context.fill();
    },
    update: function(){
        if(apple.x == snake.bodyParty[0].x && apple.y == snake.bodyParty[0].y){
            snake.grow();
            this.move();
        }
        this.check();
    },
    check: function(){
        snake.bodyParty.map((obj) => {
            let pos = {x: obj.x, y: obj.y};
            if(pos.x == this.x && pos.y == this.y){
                this.move();
            }
        });
    },
    move: function(){
        apple.x = Math.floor(Math.random() * width/unit);
        apple.y = Math.floor(Math.random() * height/unit);
    },
    x: width/unit /2,
    y: height/unit /2
}

function load(){
    canvas.width = width;
    canvas.height = height;

    snake.bodyParty = [
        {x: 0,y: 0}
    ];
    snake.dir = {x: 1, y: 0};

    apple.x = width/unit /2-1;
    apple.y = height/unit/2-1;

    let value = (snake.bodyParty.length).toString().padStart(4,'0');
    document.getElementById('counter').textContent = value;

    INGAME = true;
    loop();
}
function update(){
    apple.update();
    snake.update();
}
function draw(){
    Grid();
    apple.draw();
    snake.draw();
}
function press(key, name){
    // console.log(name+': '+key);
    switch(key){
        case 38:
            snake.dir.x = 0;
            snake.dir.y = -1;
            break;
        case 40:
            snake.dir.x = 0;
            snake.dir.y = 1;
            break;
        case 37:
            snake.dir.x = -1;
            snake.dir.y = 0;
            break;
        case 39:
            snake.dir.x = 1;
            snake.dir.y = 0;
            break;
        case 13:
            if(INGAME == false){
                load();   
            }
        default:
            break;
    }
}
function lose(){
    if(record < snake.bodyParty.length){
        record = snake.bodyParty.length;
        document.getElementById('record').textContent = record.toString().padStart(4,'0');
    }
    context.fillStyle = '#000000';
    context.fillRect(0,0,width,height);

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = "18px Courier";
    context.fillText('aperte "Enter" para reiniciar',width/2,height/4);
    context.drawImage(deadSnake, width/2 - 120/2, height/2 - 120/2);
    INGAME = false; 
}

function loop(){
    setTimeout(function(){
        update();
        draw();
        if(INGAME == true){
            loop();
        }else{
            lose();
        }
    }, DELAY);
};load();
window.addEventListener("keydown", (key) => {
    press(key.keyCode, key.key);
});