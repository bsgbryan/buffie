// Generated by CoffeeScript 1.8.0
(function() {
  var buffie, q;

  q = require('q');

  buffie = function(res, mime_type) {
    var data, dataLen, deferred;
    if (mime_type == null) {
      mime_type = 'application/json';
    }
    data = [];
    dataLen = 0;
    deferred = q.defer();
    console.log('STATUS CODE', res.statusCode);
    if (res.statusCode > 200) {
      setTimeout(function() {
        console.log("REJECTED STATUS CODE", res.statusCode);
        return deferred.reject(res.statusCode);
      }, 0);
    } else {
      res.on('data', function(chunk) {
        data.push(chunk);
        dataLen += chunk.length;
        return deferred.notify(chunk);
      });
      res.on('end', function() {
        var buf, d, i, out, pos, _i, _len;
        buf = new Buffer(dataLen);
        pos = 0;
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          d = data[i];
          data[i].copy(buf, pos);
          pos += data[i].length;
        }
        if (mime_type === 'application/json') {
          out = JSON.parse(buf.toString('utf-8'));
        } else {
          out = buf.toString('utf-8');
        }
        return deferred.resolve(out);
      });
    }
    return deferred.promise;
  };

  module.exports = buffie;

}).call(this);
