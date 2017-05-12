import * as express from 'express';
import * as bodyParser from 'body-parser';

const server = express();

// Setting default port to 5000
let port = process.env.PORT || 5000;

// Attaching body-parser json
server.use(bodyParser.json);

server.listen(port, () => {
  console.log('Server is running at ' + port + ' ...');
});
