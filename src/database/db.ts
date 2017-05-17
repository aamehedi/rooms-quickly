import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger } from '../util/logger';

(mongoose as any).Promise = global.Promise;

const database : string = config.get('database') as string;

const db = mongoose.connect(database)
  .then(() => {
    logger.debug('MongoDB have been connected.');
  }).catch((err) => {
    return logger.error(err);
  });

export {db};
