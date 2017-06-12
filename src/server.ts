import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import { logger, expressLogger } from './util/logger';
import { router } from './router';

const server = express();
const port = config.get('port');

// Attaching Express Winston Logger
server.use(expressLogger);

// Attaching body-parser json
server.use(bodyParser.json());

router(server);

server.listen(port);
logger.debug(`Server is running at ${port} ...`);
