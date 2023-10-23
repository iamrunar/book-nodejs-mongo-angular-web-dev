const userWord = require('./models/user-word.js')

function FreeformMemoryDb() {
    this.users = [];
    this.tokens = [];
    this.usersWords = [];
}

function DatabaseClient(connectionString) {
    this.db = new FreeformMemoryDb();

    this.users = {
        addNew: function (userName) {
            console.log('DB. Create new user.');
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

            storeBatch: function (userName, usersWords){
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
            }
        }
}

exports.DatabaseClient = DatabaseClient;