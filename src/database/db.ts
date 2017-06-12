import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger } from '../util/logger';

(mongoose as any).Promise = global.Promise;

const database: string = config.get('database') as string;
const connection = mongoose.createConnection(database);

connection.on("connected", () => {
  logger.debug("MongoDB have been connected.");
})
  .on("error", (error: Error) => {
    logger.error(JSON.stringify(error, null, '\t'));
  })
  .on("disconnected", () => {
    logger.debug("MongoDB have been disconnected.");
  });

process.on('SIGINT', () => {
  mongoose.connection
    .close(() => {
      logger.debug('Mongoose default connection disconnected through app termination.');
      process.exit(0);
    });
});

export { connection };
