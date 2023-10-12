// ES5
// create server that
// + listen localhost:8080
// + on GET `/hello` > 200 <h1>Hi!</h1><p>my dude</p>
// + on GET `/weather?ncity=<cityName>` > request weather from another site and response simple data (+31 C cloudy)
// * on POST form > save file to 'usr'
// * on GET `/file?name=<file_name>` > 200 if it file_name exists in usr => response by content
// * on another path > 404 <h1>Not found</h1>
// * log on each request (use pipe)
// * create server with https

//WARNING! You should to create ~/my_data/weatherApi_com.key with weatherapi.com key

const http = require('http');

const urlParser = require('url');
const fs = require('fs')
const os = require('os');
const port = 8080;
const getHtmlTitleText = function (titleH1) { return `<html><body><h1>${titleH1}</h1></body></html>` }
const getHtmlTitleWithMessageText = function (title, message) { return `<html><body><h1>${title}</h1><p>${message}</p></body></html>` }
const weatherApiKey=fs.readFileSync(os.homedir()+'/my_data/weatherApi_com.key');

const server = http.createServer(function (req, res) {
    console.log('New request', req.url)

    var url = new urlParser.URL(req.url, "http://localhost/");
    if (req.method === 'GET' && url.pathname === '/hello') {
        res.setHeader("Content-Type", "text/html")
        res.writeHead(200);
        res.end(getHtmlTitleWithMessageText("Hi", "my dude"));
        return;
    }

    if (req.method === 'GET' && url.pathname === '/weather') {
        const city = url.searchParams.get('city');
        console.log('City url',url.search, city );
        if (!city){
            res.writeHead(400, {
                'content-type': 'text/html'
            });
            res.end(getHtmlTitleText("The city param was not found"));
            return;
        }
        requestWeather(city, function(json){
            res.writeHead(200, {
                'content-type': 'text/html'
            })
            res.end(getHtmlTitleWithMessageText(city, `Current temperature is ${getNumWithSignChar(json.temp)} C ${json.condition? json.condition.toLowerCase():""}`))
        }, function (error){
            console.error('Server returned error', error.message)
            res.writeHead(400, {
                'content-type': 'text/html'
            });
            res.end(getHtmlTitleWithMessageText("Not found", "Weather server couldn't process response.\nAnd he returned error: "+error.message));
        });
        return;
    }

    res.writeHead(404);
    res.end(getHtmlTitleText("Not found"))
});

console.log('Listen to', port)
server.listen(port).on('error', function (err){
    console.err('Failed to start server',err)
})

function getNumWithSignChar(num){
    return num>0?'+'+num:num;
}

function requestWeather(city, callback, errorCallback) {
    const getWeatherApiUrl = function (city) {
        return `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}0&q=${city}&aqi=no`;
    }

    var requestUrl = getWeatherApiUrl(city);
    getJsonFromApi(requestUrl, function (data) {
        callback({
            temp: data.current.temp_c,
            condition: data.current.condition.text,
        })
    }, function (error) {
        errorCallback(error);
    });
}

function getJsonFromApi(apiUrl, callback, errorCallback) {
    http.get(apiUrl, function(response) {
        const { statusCode, statusMessage } = response;
    
        if (statusCode !== 200) {
            console.error('Weather API error:', statusCode, statusMessage)
            errorCallback(Error(statusMessage || statusCode + " Error response"));
            return;
        }
        var buffer = [];
        response.on('data', function (chunk) {
            buffer.push(chunk)
        });
        response.on('end', function () {
            const responseData = Buffer.concat(buffer).toString();
            var responseJson;
            console.log('Weather API responsed:', responseData);
            try{
                responseJson = JSON.parse(responseData);
            }
            catch(err){
                errorCallback(Error('Cannt parse weather api response. It was', responseData, 'error', err))
            }
            if (responseJson){
                callback(responseJson)
            }
        });
        return;
    }).on('error', function (e) {
        errorCallback(e)
    });
}

