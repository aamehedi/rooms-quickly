import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as i18n from 'i18n';
import * as config from 'config';
import * as mongoose from 'mongoose';
import { db } from './database/db';
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

db
  .then(() => {
    return server.listen(port);
  }).then(() => {
    logger.debug(`Server is running at ${port} ...`);
  }).catch((err) => {
    logger.error(err);
  });

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.debug('Mongoose default connection disconnected through app termination.');
    process.exit(0); 
  }); 
});
