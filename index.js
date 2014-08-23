// Generated by CoffeeScript 1.7.1
(function() {
  var buffie, q;

  q = require('q');

  buffie = function(res) {
    var data, dataLen, deferred;
    data = [];
    dataLen = 0;
    deferred = q.defer();
    if (res.statusCode > 200) {
      setTimeout(function() {
        return deferred.reject({
          httpStatus: res.statusCode
        });
      }, 0);
    } else {
      res.on('data', function(chunk) {
        data.push(chunk);
        dataLen += chunk.length;
        return deferred.notify(chunk);
      });
      res.on('end', function() {
        var buf, d, i, pos, _i, _len;
        buf = new Buffer(dataLen);
        pos = 0;
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          d = data[i];
          data[i].copy(buf, pos);
          pos += data[i].length;
        }
        return deferred.resolve(JSON.parse(buf.toString('utf-8')));
      });
    }
    return deferred.promise;
  };

  module.exports = buffie;

}).call(this);
