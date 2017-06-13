import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger } from '../util/logger';

(mongoose as any).Promise = global.Promise;

/**
 * This function is responsible for logging different events (currently
 * "connected", "error", and "disconnected") of the mongoose Connection instance.
 */
const logConnection = (con: mongoose.Connection) => {
  con.on("connected", () => {
    logger.debug("MongoDB have been connected.");
  })
    .on("error", (error: Error) => {
      logger.error(JSON.stringify(error, null, '\t'));
    })
    .on("disconnected", () => {
      logger.debug("MongoDB have been disconnected.");
    });
};

/**
 * This function is responsible for ensuring the mongose Connection instance is
 * closed while the process is terminated.
 */
const safeClose = (con: mongoose.Connection, proc: NodeJS.Process) => {
  proc.on('SIGINT', () => {
    con.close(() => {
      logger.debug('Mongoose default connection disconnected through app termination.');
      process.exit(0);
    });
  });
};

const database: string = config.get('database') as string;
const connection: mongoose.Connection = mongoose.createConnection(database);

logConnection(connection);
safeClose(connection, process);

export { connection };
