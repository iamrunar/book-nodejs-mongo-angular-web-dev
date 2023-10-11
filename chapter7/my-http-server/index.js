// ES5
// create server that
// * listen localhost:8080
// * on GET `/hello` > 200 <h1>Hi!</h1><p>my dude</p>
// * on GET `/weather` > request weather from another site and response simple data (+31 C cloudy)
// * on POST form > save file to 'usr'
// * on GET `/file?name=<file_name>` > 200 if it file_name exists in usr => response by content
// * on another path > 404 <h1>Not found</h1>
// * log on each request (use pipe)
// * create server with https


const http = require('node:http');
const urlParser = require('node:url');
const port = 8080;
const getHtmlTitleText = function(titleH1) { return `<html><body><h1>${titleH1}</h1></body></html>` }
const getHtmlTitleWithMessageText = function(title, message) { return `<html><body><h1>${title}</h1><p>${message}</p></body></html>` }

const server = http.createServer(function(req,res){
    console.log("New request", url);

    var url = urlParser.parse(req.url);
    if (req.method==='GET' && url.pathname === '/hello'){
        res.setHeader("Content-Type", "text/html")
        res.writeHead(200);
        res.end(getHtmlTitleWithMessageText("Hi", "my dude"));
        return;
    }
    res.writeHead(404);
    res.end(getHtmlTitleText("Not found"))
});

console.log('Listening', port)
server.listen(port)
