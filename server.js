let express = require('express');
let bodyParser = require('body-parser');
let server = express();

// Setting default port to 5000
let port = process.env.PORT || 5000;

// Attaching body-parser json
server.use(bodyParser.json);

server.listen(port, function() {
  console.log('Server is running at ' + port + ' ...');
});
