var express=require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const jsonParser = bodyParser.json();
const url = "mongodb://localhost:27017/usersdb";
//  
var main=require('./main');
var calc=main.calc;



//delete1();
function delete1(){
  mongoClient.connect(url, function(err, client){
     
    if(err) return console.log(err);
      
    const db = client.db("records");
    db.collection("users").deleteMany({}, function(err, result){
              
        //console.log(result);
        client.close();
    });
  });  
} 

//CreateDB();
function CreateDB(){
    mongoClient.connect(url, function(err, client){
          
        const db = client.db("records");
        const collection = db.collection("users");
        var _id=0;
        let records =[
          {record: "Привет!", login: 'login1', id: _id++},
          {record: "Как дела?", login: 'login6', id: _id++},
          {record: "Да ничего ", login: 'login1', id: _id++},
          {record: "Ладно", login: 'AlexeyCherevko1976', id: _id++}
          ] ;
        for(var i=0; i<records.length; i++){
            collection.insertOne(records[i], function(err, result){
              
            if(err){ 
                return console.log(err);
            }
            //console.log(result.ops);
            client.close();
            });            
        }

    });    
}

app.post("/createUser", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);      
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var user = {login: userLogin, password: userPassword, n1:''};      
    var sendInsert=calc.createUserdb(user, function (last){
        res.send(last);
    });

}); 

app.post("/IdenticUser", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);      
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var user = {login: userLogin, password: userPassword, n1:''};      
    var sendInsert=calc.identicUserdb(user, function (last){
        res.send(last);
    });

}); 
 // 187 
//app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/chat.html');
});

app.get("/loadRecords", function(req, res){
    calc.loadRecords(o=>res.send(o));
});

app.post("/createRecord", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);      
    var userRecord = req.body.record;
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var user = {record: userRecord, login: userLogin, password: userPassword};      
    var sendInsert=calc.createRecord(user, function (last){ //createUserdb
        res.send(last);
    });

});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});