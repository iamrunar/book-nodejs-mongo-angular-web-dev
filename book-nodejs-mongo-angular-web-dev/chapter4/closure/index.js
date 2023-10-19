var cars = ['vaz','volga','fiat','ford']

for (const car of cars){
    var message = 'my car is '+car;
    logCar(function(){
        console.log('unclosure', message);
    });
}


for (const car of cars){
    var message = 'my car is '+car;
    (function(m){
        logCar(function(){
            console.log('closure', m);
        });
    })(message)
}

function logCar(callback){
    setImmediate(function(){
        callback();
    })
}
