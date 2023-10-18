// ES5
// create server that
// + listen localhost:8080
// + on GET `/hello` > 200 <h1>Hi!</h1><p>my dude</p>
// + on GET `/weather?ncity=<cityName>` > request weather from another site and response simple data (+31 C cloudy)
// * on GET /file-form: response <form action="send"><input type="textbox"><input type="file"/></form>
// * on POST form > save file to 'usr'
// * on GET `/file?name=<file_name>` > 200 if it file_name exists in usr => response by content
// * on another path > 404 <h1>Not found</h1>

//WARNING! You should to create ~/my_data/weatherApi_com.key with weatherapi.com key

const http = require('http');
const formUtils = require('./utils/form-utils')

const urlParser = require('url');
const fs = require('fs')
const os = require('os');
const port = 8080;
const getHtmlTitleText = function (titleH1) { return `<html><body><h1>${titleH1}</h1></body></html>` }
const getHtmlTitleWithMessageText = function (title, message) { return `<html><body><h1>${title}</h1><p>${message}</p></body></html>` }
const weatherApiKey=fs.readFileSync(os.homedir()+'/my_data/weatherApi_com.key');

const server = http.createServer(function (req, res) {
    console.log('New request', req.method, req.url)

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

    if (req.method === 'GET' && url.pathname === '/file-form'){
        fs.readFile('templates/form-file.html', function(err, data){
            if (err){
                res.writeHead(500, 'Template not found');
                res.end(getHtmlTitleWithMessageText('No file content', 'File open error'))
                return;
            }

            res.writeHead(200, undefined, {
                "content-type": "text/html"
            });
            res.end(data)
        })
        return;
    }

    if (req.method === 'POST' && url.pathname === '/form-action'){
        const {headers} = req;
        if (!headers['content-type']?.includes('multipart/form-data')){
            console.error('Unsupported content-type',headers['content-type'])
            res.writeHead(400);
            res.end('Unsupported request header');
            return;
        }

        console.log('boundary',headers['content-type'])
        const data=[];
        req.on('data', function(chunk){
            data.push(chunk);
        })
        req.on('end', function(){
            const body = Buffer.concat(data);
            fs.writeFileSync('tmp/tempalte.data', body);
            const boundaryName = formUtils.extractBoundaryName(headers['content-type']);
            const fileData = formUtils.extractFile(boundaryName, body);
            
            if (fileData){
                const fileNameA = fileData.fileName;
                const fileBuffer = body.subarray(fileData.startOffset, fileData.endOffset);
                saveFile(fileNameA, fileBuffer);
            }
            else {
                console.error('File in form-data not found');
                res.writeHead(400);
                res.end('File in form-data not found');
                return;
            }


            function saveFile(fileName, fileData){
                fs.mkdir('tmp', function(err){
                    fs.writeFile('tmp/'+fileName, fileData, function(err){
                        if (err){
                            console.error('Cannt write file',err);
                            res.writeHead(500);
                            res.end('Cannt write file');
                            return;
                        }
                        console.log(`file wrote`);
                        res.writeHead(200);
                        res.end('OK');
                    });
                });
            }
          
        })

        req.on('error', function(err){
            res.writeHead(400);
            res.end('Client error');
            console.error(`client error = ${err}`);
        })
        console.log('form-action')
        return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/file/')){
        const fileName = url.pathname.substring('/file/'.length)
        const serverFileName = 'tmp/'+fileName;
        console.log('request file ',fileName)
        if (!fileName){
            res.writeHead(400, 'No query param name');
            res.end(getHtmlTitleWithMessageText('Invalid param', 'no query param name'));
            return;
        }

        fs.stat(serverFileName, function(err, stats){
            if (!err && !stats.isFile()){
                err = Error('It is not file');
            }
            if (err){
                console.error('File not found', err);
                res.writeHead(404, 'File not found');
                res.end(getHtmlTitleWithMessageText('File not found', `File ${fileName} not found`));
                return;
            }

            fs.readFile(serverFileName, function(err, data){
                if (err){
                    console.error('File cannt read', err);
                    res.writeHead(500, 'File cannt read');
                    res.end(getHtmlTitleWithMessageText('File cannt read', `File ${fileName} cannt read`));
                    return;
                }

                res.writeHead(200, 'ok', {
                    'content-type': 'application/octet-stream',
                    'content-length': stats.size
                });
                res.write(data);
            })
        });
        return;
    }

    res.writeHead(404);
    res.end(getHtmlTitleText("Not found"))
});

console.log('Listen to', port)
server.listen(port).on('error', function (err){
    console.error('Failed to start server',err)
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

