import EventEmitter from 'node:events';

class Account extends EventEmitter {

    balance = 0;

    constructor(){
        super();
    }
    
    deposite(amount){
        this.balance+=amount;

        this.emit('balanceChanged', this.balance);
    }

    withdraw(amount){
        this.balance-=amount;
        this.emit('balanceChanged', this.balance);
    }
}

function displayBalance(newBalance){
    console.log("Balance changed to $%d", newBalance)
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