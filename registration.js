const express = require("express");
const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
  
const app = express();
const jsonParser = bodyParser.json();
const url = "mongodb://localhost:27017/usersdb";

var main=require('./main');
var calc=main.calc;
//console.log(calc.pow2(100));

//CreateDB();
deleteDB('records');
function deleteDB(nameDB){
//function deleteDB(id){
    calc.loadRecords(o=>D1(o));
  function D1(arr){
    for (var i=0; i<arr.length; i++){
        id=arr[i]['_id']; console.log(id);
        
         mongoClient.connect(url, function(err, client){
        client.db(nameDB).collection("users").findOneAndDelete({_id: id}, function(err, result){
             // console.log(arr[i]['_id']);
            if(err){ answer=res.status(400).send();}
            
            client.close();
            
            });
        });       
    }

  }

}



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

//app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/registration.html');
});

app.get("/api/users", function(req, res){
    calc.loadUsers(o=>res.send(o));
});

//app.get("/api/users/:id", function(req, res){ 
app.get("/loadUser/:id", function(req, res){       
    var id = new objectId(req.params.id);
    calc.loadUser(id, o=>res.send(o));
});
  
app.post("/createUser", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);      
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var user = {login: userLogin, password: userPassword, n1:''};      
    var sendInsert=calc.createUserdb(user, function (last){
        res.send(last);
    });

});
   
app.delete("/api/users/:id", function(req, res){
    var id = new objectId(req.params.id);
    calc.deleteUser(id, o=>res.send(o));       
});
  
app.put("/api/users", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var userLogin = req.body.login;
    var userPassword = req.body.password;
     calc.putApiUsers(id, userLogin, userPassword, o=>res.send(o)); 

});
   
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});