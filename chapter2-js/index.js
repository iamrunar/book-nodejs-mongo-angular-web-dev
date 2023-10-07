//ES5
// parents have 5 childrens, each children -2 years from first. first.yo=20, 
// each children has own id
// id-names: 199-martin 399-john 299-methew 599-katrin 099-brew (switch only)
// print 
// 1 make array with all children then print it
// 2 for each children make function which return delta from input YO (40) (3 different ways). print it
// 3 new children birthd add and print

const firstChildYO = 20
const numberOfChildren = 5;
const yoDeltaFromPrevious = 2;
var names = ['martin', 'john', 'methew', 'katrin', 'brew']
var children = []

Child.prototype = {
    delta2: function(yo){
        return 0;
    }
}


for (childNumber = 1, yo = firstChildYO; childNumber<=numberOfChildren; childNumber++, yo-=yoDeltaFromPrevious){
    const childName = names[childNumber-1];
    const hisId = getIdByName(childName);
    const child = new Child(hisId, childName, yo);
    children.push(child)
}

console.log('1. children', JSON.stringify(children))

Child.prototype .delta2 = function(yo){
    return yo - this.yo;
}

Child.prototype.delta4 = function(yo){
    return yo - this.yo*2;
}
console.log('2. delta')
for (const childNumber in children){
    const child = children[childNumber];
    child.delta3 = function(yo){
        return this.yo+yo;
    }
    console.log('Children',child['name'], 'yo',child.yo, 'delta1',child['delta1'](40), 'delta2',child.delta2(40), 'delta3',child.delta3(40), 'delta3',child.delta4(40))
}

const newChildNotChildOfChild = {
    id: 10,
    name: 'hz',
    yo: 1,
    delta1: function(yo){
        return this.yo-yo;
    }
}
children.push(newChildNotChildOfChild)
console.log('3. Added new child', JSON.stringify(children), 'delta',newChildNotChildOfChild.delta1(40))

function Child(id, name, yo){
    this.id = id;
    this.name = name;
    this.yo=yo;
    this.delta1 = function(yo) {
        return this.yo - yo;
    }
}

function getIdByName(name){
    switch (name){
        case 'martin':
            return 199;
        case 'john':
            return 399;
        case 'methew':
            return 299;
        case 'katrin':
            return 599;
        case 'brew':
            return 99;
        default:
            throw Error(`This name is not supporting ${name}`)
    }
}