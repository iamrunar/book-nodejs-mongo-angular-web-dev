function UserWord(word, initialCount = 0){
    this.word = word;
    this.count = initialCount;
}

UserWord.prototype.toString = function() {
    return "UW "+JSON.stringify({word: this.word, count: this.count});
}

UserWord.prototype.addYet = function(number = 1) {
    this.count+=number;
}

exports.UserWord = UserWord;