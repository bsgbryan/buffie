Overview
--------

__NOTE__ _`buffie` only handles response data that can be represented as JSON_

So this is a pretty basic concept, and may be a bit moot with `pipe` and all.

But, it's been written and it's been helpful so far - so here we go!

`buffie` simply wraps the generation of an http response in a promise. This means
you don't have to concern yourself with building up a `Buffer`, populating it, and
parsing the result to JSON - especially helpful if you're only interested in dealing
with the response once it's complete.

If you'd like, you can listen for the `progress` events and handle each chunk however
you wish.

Initailization
--------------

Our only external dependency is `q` for promises.

    q = require 'q'

buffie
------

`buffie` takes an http response object, listens to it's `data` and `end` events, and
returns a JSON object once the response has completed.

If the http response code is anything other than `200` the promise is rejected.

If the response code is `200`, `buffie` processes each chunk as it comes across the response.
If you'd like to process each chunk, just listen to the promise's `progress` event.

Once the response is complete a JSON object representing it's data is built and passed to the
`then` event.

    buffie = (res, mime_type = 'application/json') ->
      data    = [ ]
      dataLen = 0
      deferred = q.defer()
      console.log 'STATUS CODE', res.statusCode
      if res.statusCode > 200
        setTimeout () ->
          console.log "REJECTED STATUS CODE", res.statusCode
          deferred.reject res.statusCode
        , 0
      else
        res.on 'data', (chunk) ->
          data.push chunk
          dataLen += chunk.length
          deferred.notify chunk

        res.on 'end', () ->
          buf = new Buffer dataLen
          pos = 0

          for d, i in data
            data[i].copy buf, pos
            pos += data[i].length

          if mime_type == 'application/json'
            out = JSON.parse buf.toString 'utf-8'
          else
            out = buf.toString 'utf-8'

          deferred.resolve out

      deferred.promise

Public interface
----------------

    module.exports = buffie