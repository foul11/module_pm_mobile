var crypto = require('crypto');
const { IncomingMessage, ServerResponse } = require('http');
const fresh = require('fresh');

var NULL = new Buffer(1);
NULL.writeUInt8(0x0, 0);

module.exports = function () {
    // A data structure that holds runtime calculated content hashes.
    // Example:
    // {
    //   '/path/to/resource/with/vary/headers': {
    //     vary: [ 'Accept-Encoding', 'Accept-Language' ],
    //     md5s: {
    //       <binary hash of variable header values>: <md5 of content>,
    //       <another binary hash of variable header values>: <another md5 of content>
    //     }
    //   },
    //   '/path/to/resource/without/vary/headers': {
    //     md5: <md5 of content>
    //   }
    // }
    var etags = {
    };

    // given a request, and a set of vary headers, generate a hash representing
    // the headers.
    function hashVaryHeaders(vary, req) {
        var hash = crypto.createHash('md5');

        vary.forEach(function (header) {
            hash.update(req.headers[header] !== undefined ? req.headers[header] : NULL);
            hash.update(NULL);
        });

        return hash.digest(); // yes sir, we are using binary keys.
    }

    // given a request, see if we have an etag for it
    function getETag(r) {
        var etag;

        if (etags.hasOwnProperty(r.path)) {
            if (etags[r.path].vary) {
                var hash = hashVaryHeaders(etags[r.path].vary, r);
                etag = etags[r.path].md5s[hash];
            } else {
                etag = etags[r.path].md5;
            }
        }

        return etag;
    }

    function isFresh(req, res) {
        return fresh(req.headers, {
            etag: res.getHeader('ETag'),
            'last-modified': res.getHeader('Last-Modified')
        })
    }
    
    // function chunks (buffer, chunkSize) {
    //     var result = [];
    //     var len = buffer.length;
    //     var i = 0;
    
    //     while (i < len) {
    //         result.push(buffer.subarray(i, i += chunkSize));
    //     }
        
    //     return result;
    // }

    return function (/** @type {IncomingMessage} */ req, /** @type {ServerResponse} */ res, next) {
        res.etagify = function () {
            // if there's an ETag already on the response, do nothing
            if (res.getHeader('ETag')) return;

            // otherwise, eavsedrop on the outbound response and generate a
            // content-based hash.
            const buff = [];
            var hash = crypto.createHash('md5');
            
            var write = res.write;
            res.write = function (chunk) {
                hash.update(chunk);
                buff.push(chunk);
                // write.call(res, chunk);
            };
            
            var end = res.end;
            res.end = function (body) {
                if (body) hash.update(body);
                
                let actial_hash = hash.digest('hex');
                var vary = res.getHeader('vary');
                if (vary) {
                    if (!etags[req.path]) {
                        etags[req.path] = {
                            vary: vary.split(',').map(function (x) { return x.trim().toLowerCase(); }),
                            md5s: {}
                        };
                    }
                    var hdrhash = hashVaryHeaders(etags[req.path].vary, req);
                    etags[req.path].md5s[hdrhash] = actial_hash;
                } else {
                    etags[req.path] = { md5: actial_hash };
                }
                
                var etag = getETag(req);
                
                if (etag) {
                    res.setHeader('ETag', '"' + etag + '"');
                    
                    if (req.method.toLocaleUpperCase().match(/^GET$/)) {
                        if (isFresh(req, res)) {
                            res.removeHeader('ETag');
                            res.statusCode = 304;
                            return end.apply(res, arguments);
                        }
                    }
                }
                
                for (const chunk of buff) {
                    write.call(res, chunk);
                }
                
                end.apply(res, arguments);
            }
        };

        next();
    };
};