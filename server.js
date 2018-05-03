'use strict';
class Player{
  constructor(type){
    this.x=0,
    this.y=0,
    this.type =type
  }
  // Getter
 get get_x_coordinate() {
   return this.x;
 }
 get get_y_coordinate(){
   return this.y;
 }
 get get_type(){
   return this.type;
 }
 // Setter
 set set_x_coordinate(data){
   this.x= data;
 }
 set set_y_coordinate(data){
   this.y=data;
 }
}
class Room {
  constructor(name, good,bad) {
    this.auto_increment_id=0;
    this.name = name;
    this.good = good;
    this.bad=bad;
    this.players = [];
    this.sockets_list = [];
  }
  // Getter
  get roomName() {
    return this.name;
  }
  get getGoodNumbers(){
    return this.good;
  }
  get getBadNumbers(){
    return this.bad;
  }
  get get_auto_increment_id(){
    return this.auto_increment_id;
  }
  // Setter
  set setGoodNumbers(data){
    this.good= data;
  }
  set setBadNumbers(data){
    this.bad=data;
  }
  set set_auto_increment_id(data){
     this.auto_increment_id = data;
  } 
  // add new socket to the room
  addSocket(idx,socket){
    this.sockets_list[idx]=socket;
  }
  // add new player to the room
  addPlayer(idx,player){
    this.players[idx]=player;
  }
}

let rooms={};
const system_room_number=5;
const max_players=3;
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String
});

const User = mongoose.model('user', userSchema);


var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app=express();

app.use(session({secret: 'work hard',
resave: true,
saveUninitialized: false}));



var server = app.listen(3000,function(){
  for(let i =1;i<=system_room_number;i++){
    rooms[i]= new Room((i),0,0);
 }
  
});

app.use(express.static('public'));
var socket = require('socket.io');
var io=socket(server);
io.sockets.on('connection',newConnection);
function newConnection(socket){
  socket.on('room', function(data) {
      socket.join(data.room,function(){

         rooms[data.room].players.forEach(element => {
          socket.emit('mouse', {x: element.get_x_coordinate, y: element.get_y_coordinate , room:data.room});
         });

          socket.idx=rooms[data.room].get_auto_increment_id;
          socket.roomName= data.room;
          rooms[data.room].set_auto_increment_id=rooms[data.room].get_auto_increment_id+1;
          rooms[data.room].addSocket(socket.idx,socket);
          rooms[data.room].addPlayer(socket.idx,new Player(data.type));
          console.log(data.good);
          console.log(data.bad);
          rooms[data.room].setGoodNumbers=data.good;
          rooms[data.room].setBadNumbers=data.bad;
          console.log(rooms[data.room].getGoodNumbers);
         
      });

  });
 // socket.on('disconnect', function() {
 //    delete rooms[socket.roomName].players[socket.id];
// });
 
 
 socket.on('mouse',function(data){

    socket.broadcast.to(data.room).emit('mouse',data);
    rooms[data.room].players[socket.idx].set_x_coordinate=data.x;
    rooms[data.room].players[socket.idx].set_y_coordinate=data.y;
    
});

}

app.get('/rooms',function(req,response){
  response.writeHead(200, {"Content-Type": "application/json"});
  var temp =[];
  for (let key in rooms) {
    let val = rooms[key];
    if(val.good<max_players || val.bad<max_players){
    var data = {
      name : val.name,
      good : val.good,
      bad : val.bad
    }
    temp.push(data);
  }
 }
  var json = JSON.stringify({ 
    rooms : temp
  });
  response.end(json);
  
});

mongoose.connect('mongodb://localhost/slackers');
mongoose.connection.once('open', function(){
    console.log('Connection has been made, now make fireworks...');
    
}).on('error', function(error){
    console.log('Connection error:', error);
});


app.get('/', function(req, res){

  console.log("hello");

});

app.post('/login', urlencodedParser  ,function(req, res,next){
  if (req.sessionID) {
      console.log("post function");
      User.findOne({username: req.body.username}).then(function(result){
        if(result.username == req.body.username && result.password == req.body.password){
           res.send('welcome, ' + req.body.username + ' , you password is ' + req.body.password + ' , session ID : '+ req.sessionID);
        }else{
          popup.alert({content: 'invalid username or password'});
        }
      });
  }else{
    console.log("req.session is false");
  }
});

app.post('/register',urlencodedParser,function(req,res){
    if (req.sessionID) {
      console.log("post function");
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });

      console.log(user);

      User.findOne({username: req.body.username}).then(function(result){
        if(result != null && result.username == req.body.username){
          popup.alert({content: 'username is already taken'});
        }else{
          user.save().then(function(){
            res.redirect('/');
          });
        }
      });

  }else{
    console.log("req.session is false");
  }
});

app.get('/guest',urlencodedParser,function(req,res){
  if (req.sessionID) {
    res.send("I am a guest");

}else{
  console.log("req.session is false");
}
});



