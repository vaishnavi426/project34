const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button, button1, blower;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr,rope2;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var canW, canH;
var rope3, button3, fruit_con_3;

var star, starImg;
var star2, empty, one, two;
var starScore;

function preload()
{
  bg_img = loadImage('assets/background.png');
  food = loadImage('assets/melon.png');
  rabbit = loadImage('assets/Rabbit-01.png');
  starImg = loadImage('assets/star/star.png');
  empty = loadAnimation('assets/star/empty.png');
  one = loadAnimation('assets/star/one_star.png');
  two = loadAnimation('assets/star/stars.png');

  bk_song = loadSound('assets/sounds/sound1.mp3');
  sad_sound = loadSound("assets/sounds/sad.wav")
  cut_sound = loadSound('assets/sounds/rope_cut.mp3');
  eating_sound = loadSound('assets/sounds/eating_sound.mp3');
  air = loadSound('assets/sounds/air.wav');

  blink = loadAnimation("assets/blink/blink_1.png","assets/blink/blink_2.png","assets/blink/blink_3.png");
  eat = loadAnimation("assets/eat/eat_0.png" , "assets/eat/eat_1.png","assets/eat/eat_2.png","assets/eat/eat_3.png","assets/eat/eat_4.png");
  sad = loadAnimation("assets/sad/sad_1.png","assets/sad/sad_2.png","assets/sad/sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
  }

  createCanvas(canW,canH);

  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.35);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('assets/cut_btn.png');
  button.position(canW/2-110,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button1 = createImg('assets/cut_btn.png');
  button1.position(canW/2+140,30);
  button1.size(50,50);
  button1.mouseClicked(drop2);

  /*button3 = createImg('assets/cut_btn.png');
  button3.position(canW*3/4-30,canH/4-50);
  button3.size(50,50);
  button3.mouseClicked(drop3);*/

  rope = new Rope(6,{x:canW/2-100,y:30});
  rope2 = new Rope(6,{x:canW/2+170,y:30});
  //rope3 = new Rope(7,{x:canW*3/4,y:canH/4-50});
  ground = new Ground(canW/2,canH-10,canW,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(canW/2-40,canH-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(canW/4,canH/4+100,20);

  Matter.Composite.add(rope.body,fruit);
  //Matter.Composite.add(rope2.body,fruit);
  //Matter.Composite.add(rope3.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);
  //fruit_con_3 = new Link(rope3,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
  blower = createImg("assets/balloon2.png");
  blower.position(canW/2-20,canH/2-20);
  blower.size(100,120);
  blower.mouseClicked(airBlow);

  mute_btn = createImg("assets/mute.png");
  mute_btn.position(canW-100,40);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  star = createSprite(canW/2+50,30,5,5);
  star.addImage(starImg);
  star.scale = 0.02;

  star2 = createSprite(canW/3+20,canH/2-20,5,5);
  star2.addImage(starImg);
  star2.scale = 0.02;

  starScore = createSprite(canW/6,50,10,10);
  starScore.scale = 0.2;
  starScore.addAnimation('empty',empty);
  starScore.addAnimation('one',one);
  starScore.addAnimation('two',two);
  starScore.changeAnimation('empty');
}

function draw() 
{
  background(51);
  imageMode(CENTER);
  image(bg_img,canW/2,canH/2,canW,canH);

  push();
  imageMode(CENTER);
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();
  //rope3.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny,80)==true)
  {
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    bk_song.stop();
    eating_sound.play();
  }


  if(fruit!=null && fruit.position.y>=canH-50)
  {
    bunny.changeAnimation('crying');
    fruit=null;
    bk_song.stop();
    sad_sound.play();
   }
   
  if(collide(fruit,star,20)==true) {
    star.visible = false;
    starScore.changeAnimation('one');
  }
  if(collide(fruit,star2 ,20)==true) {
    star2.visible = false;
    starScore.changeAnimation('two');
  }
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
  cut_sound.play();
}


function collide(body,sprite,x)
{
  if(body!=null)
    {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
      }
        else{
          return false;
    }
}

  
}

function airBlow() {
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:-0.001,y:-0.02});
  air.play();
}

function mute() {
  if(bk_song.isPlaying()) {
    bk_song.stop();
  }
  else{
    bk_song.play();
  }
}

function drop2()
{
  rope2.break();
  fruit_con_2.detach();
  fruit_con_2 = null; 
  cut_sound.play();
}

/*function drop3()
{
  rope3.break();
  fruit_con_3.detach();
  fruit_con_3 = null; 
  cut_sound.play();
}*/