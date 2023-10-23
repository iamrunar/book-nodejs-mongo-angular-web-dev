const express = require('express');
const url = require('url');
const dbClient = require('./database_client.js');
const UserWord = require('./models/user-word.js');
const UserWordService = require('./services/user-word-service.js');
const bodyParser = require('body-parser');

const port = 8080;

const databaseClient = new dbClient.DatabaseClient('connectionString');
const app = express();

app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.json({ type: 'application/json' }));

app.listen(port);
console.log('listen to', port);

//curl -X POST 'http://localhost:8080/users/new?name=user1'
app.post('/users/new', function (req, res) {
    const reqUrl = url.parse(req.url, true);
    const { name } = reqUrl.query;
    console.log('/users/new', name);

    if (!databaseClient.users.addNew(name)) {
        res.status(400);
        res.send(`The user ${name} already exists.`)
        return;
    }

    const token = databaseClient.tokens.login(name);

    res.status(200);
    res.send(token)
});

// curl -X POST 'http://localhost:8080/users/login?name=user1'
app.post('/users/login', function (req, res) {
    const reqUrl = url.parse(req.url, true);
    const { name } = reqUrl.query;
    console.log('/users/login', name);

    var token;
    try {
        token = databaseClient.tokens.login(name);
    } catch (err) {

        //case 
        res.status(404);
        res.send('User not found')
        return;
    }

    res.status(200);
    res.send(token)
});

// curl  -H 'user-token: user1-my-token' 'http://localhost:8080/words/stats'
app.get('/words/stats', function (req, res) {
    const userToken = req.headers['user-token'];
    if (!userToken) {
        res.status(403);
        res.send("Access denied");
        return;
    }
    if (!databaseClient.tokens.isValidToken(userToken)) {
        res.status(403);
        res.send("User access denied");
        return;
    }
    res.status(200);
    res.send({ count: 0 });
});

// curl  -H 'user-token: user1-my-token' -X POST 'http://localhost:8080/words/single?word=hello'
app.post('/words/single', function (req, res) {
    const reqUrl = url.parse(req.url, true);
    const { word } = reqUrl.query;

    const userToken = req.headers['user-token'];
    if (!userToken) {
        res.status(403);
        res.send("Access denied");
        return;
    }

    if (!databaseClient.tokens.isValidToken(userToken)) {
        res.status(403);
        res.send("User access denied");
        return;
    }
    const userName = databaseClient.tokens.getByToken(userToken);

    //to service?
    let userWord;
    try {
        userWord = databaseClient.words.find(userName, word);
    } catch (err) {
        res.status(404);
        res.send("User was deleted.");
        return;
    }
    if (!userWord) {
        userWord = new UserWord(word);
    }
    userWord.addYet();
    databaseClient.words.store(userName, userWord);

    res.status(200);
    res.send("Word stat:" + userWord);
});

/* 
   curl  -H 'user-token: user1-my-token' \
         -H 'content-type: text/plain' \
         -d 'test,test,megatest' \
         -X POST 'http://localhost:8080/words/document'
*/
app.post('/words/document', function (req, res) {
    console.log(req.body);
    const { body, headers } = req;
    const userToken = headers['user-token'];
    if (!userToken) {
        res.status(403);
        res.send("Access denied");
        return;
    }

    if (!databaseClient.tokens.isValidToken(userToken)) {
        res.status(403);
        res.send("User access denied");
        return;
    }
    const userName = databaseClient.tokens.getByToken(userToken);
    const contentType = headers['content-type'];
    if (!body) {
        res.status(400);
        res.send(`Body must be setted`);
        return;
    }
    if (contentType !== 'text/plain') {
        res.status(400);
        res.send(`Content type ${contentType} not supported`);
        return;
    }

    const inputWords = req.body.split(',').map(w => w.toLowerCase());
    const wordWithCounter = getWordWithCounter(inputWords);

    let uwUserWords;
    try {
        const wordsOnly = Object.keys(wordWithCounter);
        uwUserWords = databaseClient.words.findBatch(userName, wordsOnly);
    } catch (err) {
        console.error('err', err)
        res.status(404);
        res.send("User was deleted.");
        return;
    }

    for (const uwUserWord of uwUserWords) {
        const { word } = uwUserWord;
        const inputCountOfThisWord = wordWithCounter[word];
        if (uwUserWord.userWord) {
            uwUserWord.userWord.addYet(inputCountOfThisWord);
        }
        else {
            uwUserWord.userWord = new UserWord.UserWord(word, inputCountOfThisWord);
        }
    }
    databaseClient.words.storeBatch(userName, uwUserWords.map(uwUserWord => uwUserWord.userWord));

    res.status(200);
    res.send("Words stored" + uwUserWords.length);
});

/* 
   curl  -H 'user-token: user1-my-token' \
         -H 'content-type: application/json' \
         -d '{"url":"https://stackoverflow.com/questions/477816/which-json-content-type-do-i-use"}' \
         -X POST 'http://localhost:8080/words/external'
*/
app.post('/words/external', function(req,res){
    const externalUrl = req.body.url;
    console.log('external url', externalUrl);

    //...
});

function getWordWithCounter(words) {
    return words.reduce(function (dict, word) {
        dict[word] = word in dict ? dict[word] + 1 : 1;
        return dict;
    }, {});
}