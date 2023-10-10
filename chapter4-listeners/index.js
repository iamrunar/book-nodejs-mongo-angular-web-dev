// ECMAScript5
// A user has an account. With it, they can:
// * Deposit money
// * Withdraw money
// * Display the balance
// * Check the goal (if they have enough money in the account)
// When the user deposits or withdraws money, the event "balanceChanged" is triggered.


const EventEmitter = require('node:events');
const util = require('node:util');

util.inherits(Account, EventEmitter)

function Account(){
    EventEmitter.call(this);
    this.balance = 0;
}

Account.prototype.withdraw=function(amount){
    this.balance-=amount;
    this.emit("balanceChanged");
};
Account.prototype.deposite = function(amount){
    this.balance+=amount;
    this.emit("balanceChanged");
}

function displayBalance(){
    console.log("Balance changed to $%d", this.balance)
}
function checkGoal(){
    if (this.balance>=8){
        console.log('Goal achieved!')
    }
}
function checkOverdraw(){
    if (this.balance<0){
        console.log('Overdrawn!')
    }
}


var userAccount = new Account();
userAccount.on("balanceChanged", displayBalance);
userAccount.on("balanceChanged", checkGoal);
userAccount.on("balanceChanged", checkOverdraw);
userAccount.deposite(5);
userAccount.deposite(4);
userAccount.withdraw(5);
userAccount.withdraw(5);