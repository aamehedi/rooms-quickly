import { seed } from '../util/seedUtil';
import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger } from '../util/logger';

const numberOfRooms = config.get('seed.number_of_rooms') as number;
const numberOfPartners = config.get('seed.number_of_partners') as number;
/**
 * This function is responsible for logging an array of mongose document at log
 * level 'info'.
 */
const log = (docs: mongoose.Document[], modelName: string) => {
  logger.debug(`${modelName}s have been created in the database.`);
  docs.forEach(doc => {
    logger.info(JSON.stringify(doc, null, '\t'));
  });
};

seed(numberOfRooms, numberOfPartners, log)
  .then(() => {
    process.exit(0);
  }).catch((error: any) => {
    logger.error(error);
    process.exit(0);
  });
