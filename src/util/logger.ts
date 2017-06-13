import * as winston from 'winston';
import * as expressWinston from 'express-winston';

/**
 * This function is responsible for returning a configuration object for winston
 * logger. It takes a path parameter (optional), which it uses to identify the
 * log directory for file transports of winston logger.
 */
const configuration = (path: string = '') => {
  path = path || `${__dirname}/../../../logs/`;
  const infoPath = `${path}info.log`;
  const errorPath = `${path}error.log`;

  return {
    transports: [
      new winston.transports.Console({
        level: 'debug',
        colorize: true,
        handleExceptions: true,
        prettyPrint: true,
        humanReadableUnhandledException: true,
        timestamp: true
      }),
      new winston.transports.File({
        name: 'error-file',
        level: 'error',
        filename: errorPath,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        prettyPrint: true,
        tailable: true,
        timestamp: true
      })
      ,
      new winston.transports.File({
        name: 'info-file',
        level: 'info',
        filename: infoPath,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        prettyPrint: true,
        tailable: true,
        timestamp: true
      })
    ],
    exitOnError: false,
  };
};

const logger = new winston.Logger(configuration());

const expressLogger = expressWinston.logger(configuration());

export { logger, expressLogger, configuration };
