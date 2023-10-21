function DatabaseClient(connectionString){

    this.users = {
        addNew: function(userName){
            console.log('DB. Create new user.')
            return true;
        }
    }

    this.tokens = {
        login: function(userName){
            if (userName==='user1'){
                return 'user1-my-token'
            }

            throw Error('Not found');
        },

        isValidToken: function(token){
            if (token==='user1-my-token'){
                return true;
            }

            return false;
        }
    }
}

exports.DatabaseClient = DatabaseClient;