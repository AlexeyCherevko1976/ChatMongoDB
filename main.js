const express = require("express");
const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
  
const app = express();
const jsonParser = bodyParser.json();
const url = "mongodb://localhost:27017/usersdb";

;(function() {

  // calc - основная функция для библиотеки
  function calc(value) {
    // ...
  }

  // вспомогательная переменная
  var version = '1.1.1';  


  function pow2(value){
  	return value*value
  }

   function createRecord(user, callback){ 

        mongoClient.connect(url, function(err, client){
          var returnUser;
          client.db("users1").collection("users").find({}).toArray(function(err, users){
            extract=users.filter(o=>o['login']==user['login']);
            if(extract.length && extract[0]['login']==user['login'] &&  extract[0]['password']==user['password'] && user['records']!='' ){
               console.log('Проверка верна!');
               for (key in user){
                 console.log(key+' - '+user[key]);
               }
               console.log('|'+user['records']+'|');
               client.db("records").collection("users").insertOne(user, function(err, result){
               callback(user);             
                client.close();
                });
            }
         
            
            client.close();
          });                
        });  
  }

  function createUserdb(user, callback){ 

        mongoClient.connect(url, function(err, client){
          var returnUser;
          client.db("users1").collection("users").find({}).toArray(function(err, users){
            extract=users.filter(o=>o['login']==user['login']).length;
            var loginFilling=user['login'].length;
            var passwordFilling=user['password'].length;
            var loginLength=user['login'].length>3;
            var passwordLength=user['password'].length>4;

             //console.log(`loginFilling ${loginFilling}`);
            var answer;
            if(!extract && loginLength && passwordLength){
                client.db("users1").collection("users").insertOne(user, function(err, result){               
                //answer={user['password']};
                user={_id: user['_id']};
                client.close();
                });
            }else{               
                user={_id: '', login: '', repeat: extract, loginFill: loginFilling, passwordFill: passwordFilling, loginLen: loginLength, passwordLen: passwordLength};
            }             
            callback(user);
            client.close();
          });                
        });  
  }

    function identicUserdb(user, callback){ 

mongoClient.connect(url, function(err, client){
  var returnUser;
  client.db("users1").collection("users").find({}).toArray(function(err, users){

    extract=users.filter(o=>o['login']==user['login']);
    if (!extract.length){ return 0}      
        mongoClient.connect(url, function(err, client){
          var returnUser;
          client.db("users1").collection("users").find({}).toArray(function(err, users){
  

            callback(user);
            client.close();
          });                
        });
      });                
    });          
  }

  function loadRecords(callback){
    mongoClient.connect(url, function(err, client){
    client.db("records").collection("users").find({}).toArray(function(err, users){
        callback(users)
        client.close();
    });
    });
  }

  function loadUsers(callback){
    mongoClient.connect(url, function(err, client){
    client.db("users1").collection("users").find({}).toArray(function(err, users){
        callback(users)
        client.close();
    });
    });
  }

  function loadUser(id, callback){
    mongoClient.connect(url, function(err, client){
        client.db("users1").collection("users").findOne({_id: id}, function(err, user){
            var answer;  
            if(err){ answer=res.status(400).send();
            }else{
              answer=user;
              client.close();
            }                                      
              callback(answer);
        });
    });    
  }

function deleteUser(id, callback){
    mongoClient.connect(url, function(err, client){
        client.db("users1").collection("users").findOneAndDelete({_id: id}, function(err, result){
            var answer;  
            if(err){ answer=res.status(400).send();
            }else{
              answer=result.value;
            }
            callback(answer);
            client.close();
            
        });
    });
}

function putApiUsers(id, userLogin, userPassword, callback){
    mongoClient.connect(url, function(err, client){
        client.db("users1").collection("users").findOneAndUpdate({_id: id}, { $set: {login: userLogin, password: userPassword}},
             {returnOriginal: false },function(err, result){
            var answer;
            if(err) {answer=res.status(400).send();
            }else{
              answer=result.value;
            }
            callback(answer);
            client.close();
            
        });
    });     
} 

  calc.pow2=pow2;
  calc.createUserdb=createUserdb;
  calc.loadUsers=loadUsers;
  calc.loadRecords=loadRecords;
  calc.loadUser=loadUser;
  calc.deleteUser=deleteUser;
  calc.putApiUsers=putApiUsers;
  calc.createRecord=createRecord;
  calc.identicUserdb=identicUserdb;

  module.exports.calc=calc;
}());