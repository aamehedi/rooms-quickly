import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as i18n from 'i18n';
import * as config from 'config';
import * as mongoose from 'mongoose';
import { logger, expressLogger } from './logger'
import { router } from './router';

(mongoose as any).Promise = global.Promise;

const server = express();
const database : string = config.get('database') as string;
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

mongoose.connect(database)
  .then(() => {
    logger.debug('MongoDB have been connected.');
    return server.listen(port);
  }).then(() => {
    logger.debug('Server is running at ' + port + ' ...')
  }).catch((err) => {
    return this.done(logger.error(err.stack));
  });

export {server};
