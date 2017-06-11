import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as i18n from 'i18n';
import * as config from 'config';
import { logger, expressLogger } from './util/logger';
import { router } from './router';

const server = express();
const port = config.get('port');

// Attaching Express Winston Logger
server.use(expressLogger);

// Attaching body-parser json
server.use(bodyParser.json());

i18n.configure({
  directory: './locales'
});
server.use(i18n.init);

router(server);

server.listen(port)
logger.debug(`Server is running at ${port} ...`);
