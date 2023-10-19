function* boundaries(boundaryName, body) {
    /*
POST /test.html HTTP/1.1
Host: example.org
Content-Type: multipart/form-data;boundary="boundary"

--boundary
Content-Disposition: form-data; name="field1"

value1
--boundary
Content-Disposition: form-data; name="field2"; filename="example.txt"

value2
--boundary--
*/
    var currentBoundaryOffset = body.indexOf(boundaryName);
    while (currentBoundaryOffset >= 0) {
        const [boundaryText, startBoundaryContentHeaderOffset] = readLine(currentBoundaryOffset, body);

        if (!startBoundaryContentHeaderOffset) {
            return;
        }
        if (boundaryText.endsWith('--')) {
            console.log('finished');
            return;
        }

        // skip  /r/n after --boundary
        const [contentProperties, startBoundaryBodyOffset] = fillContentDataFromBoundaryHeader(startBoundaryContentHeaderOffset, body);

        // search --boundary after current body
        currentBoundaryOffset = body.indexOf(boundaryName, startBoundaryBodyOffset);
        //go back
        const endBoundaryBodyOffset = skipNewLineSymbols(currentBoundaryOffset - 1, body, -1);

        yield [startBoundaryBodyOffset, endBoundaryBodyOffset, contentProperties];
    }
}

function skipNewLineSymbols(offset, body, inc = +1, skip = 1) {
    var skipReturns = skip;
    while (offset < body.length) {
        const ch = body.readInt8(offset);
        if (ch == 0x0D) {
            if (skipReturns--) {
                break;
            }
        }
        if (ch !== 0x0D && ch !== 0x0A) {
            break;
        }

        offset += inc;
    }

    return offset;
}

function skipUntilNewLine(offset, body) {
    while (offset < body.length && body.readInt8(offset) != 0xd) offset++;

    return offset;
}

function readLine(offset, body) {
    const endDataOffset = skipUntilNewLine(offset, body);
    const text = body.subarray(offset, endDataOffset).toString();
    const endNewLineOffset = skipNewLineSymbols(endDataOffset + 1, body);
    return [text, endNewLineOffset]
}

function fillContentDataFromBoundaryHeader(offset, body) {
    var data = {}
    var nextOffset = offset;
    var line;
    do {
        [line, nextOffset] = readLine(nextOffset, body);
        if (line) {
            fillContentData(line, data);
        }
    } while (line);

    return [data, nextOffset];

    function getContentType(line) {
        const contentTypeMatch = line.match(/Content-(\w+)/);
        if (contentTypeMatch) {
            return contentTypeMatch[1]
        }
    }

    function fillContentData(line, contentData) {
        const contentPropertyType = getContentType(line)?.toLowerCase()
        switch (contentPropertyType) {
            case 'disposition':
                fillContentDisposition(line, contentData)
                break;
            case 'type':
                fillContentType(line, contentData);
                break;
            case 'length':
                fillContentLength(line, contentData);
                break;
            default:
                console.warn('not supported content proprty', line)
                break;
        }
    }

    function fillContentDisposition(line, contentData) {
        const disp = line.match(/Content-Disposition: form-data;(\sname=\"(?<name>.+?)\";?)?(\sfilename=\"(?<filename>.+?)\";?)?/i);
        if (disp) {
            const { groups: { name, filename } } = disp;
            contentData.contentDisposition = {
                name,
                filename
            };
            contentData.type = filename ? 'file' : 'value';
        }
    }

    function fillContentType(line, contentData) {
        const disp = line.match(/Content-Type: (.+)/i);
        if (disp) {
            contentData.contentType = disp[1];
        }
    }

    function fillContentLength(line, contentData) {
        const disp = line.match(/Content-Length: (\d+)"/i);
        if (disp) {
            contentData.contentLength = disp[1];
        }
    }
}

function extractFile(boundaryName, bodyBuffer) {
    for (const [startBoundaryBodyOffset, endBoundaryBodyOffset, contentProperties] of boundaries(boundaryName, bodyBuffer)) {
        if (contentProperties.type === 'file') {
            return new FileData('file', contentProperties.contentDisposition.filename, startBoundaryBodyOffset, endBoundaryBodyOffset);
        }
    }
}

function extractBoundaryName(contentType) {
    const boundaryIndex = contentType.indexOf('boundary=');
    const boundary = '--' + contentType.substring(boundaryIndex + 'boundary='.length);

    return boundary;
}

function FileData(type, fileName, startOffset, endOffset) {
    this.type = type;
    this.fileName = fileName;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
}

exports.extractFile = extractFile;
exports.extractBoundaryName = extractBoundaryName;