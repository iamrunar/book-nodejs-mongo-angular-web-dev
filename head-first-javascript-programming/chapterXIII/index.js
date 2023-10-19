function Dog(name, weight){
    this.name = name;
    this.weight = weight;
}

Dog.prototype.bark = function(){
    console.log(`Bark! (${this.name})`)
}

Dog.prototype.whoami = function(){
    console.log('My name is', this.name, 'and my weight is',this.weight, 'kg. And I have',(this.hasHair?'':'not'), 'hair');
}

Dog.prototype.cutHair = function (){
    this.hasHair = false;
}

Dog.prototype.hasHair = true; 

//simple implementation
console.log('==Simple implementations==');
console.log('--Street dogs');

const lucy = new Dog('lucy', 20);
const doggy = new Dog('doggy',10)

lucy.bark();
lucy.whoami();

doggy.bark();
doggy.whoami();
doggy.cutHair();
doggy.whoami();

lucy.bark = function(){
    console.log('Bark by lucy! <3')
}

lucy.bark();

//first parent
console.log('==Parents==');

function StreetDog(name, weight, district, hungry){
    Dog.call(this, name, weight);
    this.district = district;
    this.hungry = hungry;
}
StreetDog.prototype = new Dog(); // or Object.create(Dog.prototype);
StreetDog.prototype.imfrom = function(){
    console.log('I am from ',this.district)
}
StreetDog.prototype.bark = function(){
    console.log('BARK! o_O I am hungry? ',this.hungry,'!');
}

function HomeDog(name, weight, ownerName){
    Dog.call(this, name, weight);
    this.ownerName = ownerName;
}
HomeDog.prototype = Object.create(Dog.prototype); // or new Dog()
HomeDog.prototype.whoismyowner = function(){
    console.log('My owner is', this.ownerName);
}


const walkozawar = new StreetDog('Walkozawar', '50', 'Central', 'Yep')
const laconda = new StreetDog('Laconda', '35', 'Underriver', 'No')

console.log('--Street dogs');
walkozawar.bark();
walkozawar.whoami();
console.log('He has property hasHair?', Object.hasOwn(walkozawar,'hasHair'));
walkozawar.imfrom();
console.log('Check instance (see code)',walkozawar instanceof Dog, walkozawar instanceof StreetDog, walkozawar instanceof HomeDog)

laconda.bark();
laconda.cutHair();
laconda.whoami();
laconda.imfrom();
console.log('He has property hasHair?', Object.hasOwn(laconda,'hasHair'));
console.log(laconda instanceof Dog, laconda instanceof StreetDog, laconda instanceof HomeDog)

console.log('--Home dogs');
const murzik = new HomeDog('Murzik', '90', 'Kate');
const alexandra = new HomeDog('Alexandra', '80', 'Michel');

murzik.cutHair();
murzik.bark();
murzik.whoami();
console.log('He has property hasHair?', Object.hasOwn(murzik,'hasHair'));
murzik.whoismyowner();
console.log('Check instance (see code)',murzik instanceof Dog, murzik instanceof StreetDog, murzik instanceof HomeDog)

alexandra.cutHair();
alexandra.bark();
alexandra.whoami();
console.log('He has property hasHair?', Object.hasOwn(murzik,'hasHair'));
alexandra.whoismyowner();
console.log('Check instance (see code)',murzik instanceof Dog, murzik instanceof StreetDog, murzik instanceof HomeDog)
