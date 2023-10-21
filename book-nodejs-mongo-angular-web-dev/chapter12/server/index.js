const express = require('express');
const url = require('url');
const dbClient = require('./database_client.js');

const port = 8080;

const databaseClient = new dbClient.DatabaseClient('connectionString');
const app = express();


app.listen(port);
console.log('listen to', port);

//curl -X POST 'http://localhost:8080/users/new?name=user1'
app.post('/users/new', function(req, res){
    const reqUrl = url.parse(req.url, true);
    const { name } = reqUrl.query;
    console.log('/users/new', name);

    if (!databaseClient.users.addNew(name)){
        res.status(400);
        res.send(`The user ${name} already exists.`)
        return;
    }

    const token = databaseClient.tokens.login(name);
    
    res.status(200);
    res.send(token)
});

// curl -X POST 'http://localhost:8080/users/login?name=user1'
app.post('/users/login', function(req, res){
    const reqUrl = url.parse(req.url, true);
    const { name } = reqUrl.query;
    console.log('/users/login', name);

    var token;
    try{
         token = databaseClient.tokens.login(name);
    }catch(err){

        //case 
        res.status(404);
        res.send('User not found')
        return;
    }

    res.status(200);
    res.send(token)
});

// curl  -H 'user-token: user1-my-token1' 'http://localhost:8080/words/stats'
app.get('/words/stats', function(req,res){
    const userToken = req.headers['user-token'];
    if (!userToken){
        res.status(403);
        res.send("Access denied");
        return;
    }
    if (!databaseClient.tokens.isValidToken(userToken)){
        res.status(403);
        res.send("User access denied");
        return;
    }
    res.status(200);
    res.send({ count: 0 });
})