const userWord = require('./models/user-word.js')
const { MongoClient } = require('mongodb');

function FreeformMemoryDb() {
    this.users = [];
    this.tokens = [];
    this.usersWords = [];
}

const databaseName = "user_words"

function DatabaseClient(connectionString) {

    this.db = new FreeformMemoryDb();

    this.connectToDb = function (callback) {
        console.log('try connect to mongodb.')
        MongoClient.connect('mongodb://localhost:27017').then((client)=>{
            console.log('connection successed');
            const db = client.db(databaseName);
            callback(null, db);
        }, (err)=>{
            callback(err)
        });
    }

    this.initialize = function(callback){
        this.connectToDb(function (err, db) {
            if (err) {
                callback(err);
                return;
            }

            db.collectionNames()
                .then((names)=>{
                    if (!names.includes('users')) {
                        db.createCollection('users');
                    }
                    if (names.includes('tokens')) {
                        db.dropCollection('tokens');
                    }
                    db.createCollection('tokens');
                    callback(null);
                });
        });
    }

    this.clear = function (callback) {
        MongoClient.connect('mongodb://localhost', function (err, db) {
            let d = db.db(databaseName);
            d.dropDatabase(databaseName, function (error, results) {
                callback(error);
            });
        });
    }

    this.users = {
        addNew: function (userName) {
            console.info('DB. Create new user.', userName);
            MongoClient.connect('mongodb://localhost', function (err, db) {
                let d = db.db(databaseName);
            });

            if (this.db.users.indexOf(userName) >= 0) {
                throw Error('User already exists');
            }

            this.db.users.push(userName);
            return true;
        }
    }

    this.tokens = {
        login: function (userName) {
            if (userName === 'user1') {
                return 'user1-my-token'
            }

            throw Error('Not found');
        },

        isValidToken: function (token) {
            if (token === 'user1-my-token') {
                return true;
            }

            return false;
        },

        getByToken: function (token) {
            if (token === 'user1-my-token') {
                return 'user1';
            }

            throw Error('Not found');
        }
    },

    this.words = {
        // null when word was not found.
        // errr when user was not found
        find: function (userName, word) {
            if (userName !== 'user1') {
                throw Error('User not found');
            }

            return new userWord.UserWord(word);
        },

        store: function (userName, userWord) {
            const { word } = userWord;
        },

        storeBatch: function (userName, usersWords) {
            console.log(usersWords)

        },

        // return [{ word: <word>, userWord: <UserWord>}]
        // when word not found than userWord is null
        findBatch: function (userName, words) {
            if (userName !== 'user1') {
                throw Error('User not found');
            }

            const userWords = words.map(function (word) {
                return { word: word, userWord: new userWord.UserWord(word) }
            });
            return userWords;
        },

        getUserWordCount: function (userName, word) {
            return 1;
        },

        getUserWordsCount: function (userName) {
            return [{ word: 'hi', count: 1 }, { word: 'bye', count: 2 }]
        },
    }
}

exports.DatabaseClient = DatabaseClient;