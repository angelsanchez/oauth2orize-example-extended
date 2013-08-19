var http = require('http')

function getProtectedResource (path, accessToken, done) {

  var options = {
    host: 'localhost',
    path: path,
    port: '3000',
    headers: {'Authorization': 'Bearer ' + accessToken}
  };

  http.get(options, function (response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      done(null, str);
    });

  }).on("error", function(e){
  	done(e);
  });;
}

exports.getProtectedResource = getProtectedResource;
