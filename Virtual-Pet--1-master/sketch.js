
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var bedroom, washroom, garden;
var gameState;
var currentTime;

//create feed and lastFed variable here
var feed;
var lastFed;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");

bedroom = loadImage('images/Bed Room.png');
washroom = loadImage('images/Wash Room.png');
garden = loadImage('images/Garden.png');
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed the dog");
  feed.position(690,95);
  feed.mousePressed(feedDog);

  gameStateref = database.ref('gameState');
  gameStateref.on("value",function(data){
    gameState = data.val();
  })

}

function draw() {
  background(46,139,87);
  

  //write code to read fedtime value from the database 
  var feedtimeref = database.ref("FeedTime");
  feedtimeref.on("value", function(data) {
  lastFed = data.val();
  })
  
 
  //write code to display text lastFed time here
   currentTime = hour();
  fill("white");
  stroke("blue"); 
  if(lastFed>=12) {
    text("Last Feed : " + currentTime + "PM",350,30);
  } else if(lastFed==0) {
    text("Last Feed : 12 AM",350,30);
  } else {
    text("Last Feed :" + hour() + "AM",350,30);
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  if(currentTime = lastFed+1){
   foodObj. Garden();
    update("playing");
  }
  else if(currentTime = lastFed+2){
    foodObj.bedRoom();
    update("sleeping");
  }
  else if(currentTime =lastFed+3){
    foodObj.washRoom();
    update("bathing");
  }
  else{
    update("hungry");
    foodObj.show();
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0) {
  foodObj.updateFoodStock(food_stock_val * 0);
  } else {
  foodObj.updateFoodStock(food_stock_val - 1);
  }
  //write code here to update food stock and last fed time
  database.ref("/").update({
  Food:food_stock_val,
  FeedTime: hour()
  });

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}