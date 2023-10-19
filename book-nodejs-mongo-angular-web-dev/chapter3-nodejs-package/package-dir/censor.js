const uncensoredWords = ["hui","pizda","skovoroda", "dzhigurda"];
const censoredText = "***"

function getCensoredTextPls(){
    return censoredText;
}
function getUncensoriedWordsPls(){
    return uncensoredWords;
}

function censorIt(text){
    for (const word of getUncensoriedWordsPls()){
        text = text.replace(word, getCensoredTextPls())
    }
    return text;
}

exports.censor = censorIt;
exports.getCensoredText=getCensoredTextPls;
exports.getUncensoriedWords=getUncensoriedWordsPls;