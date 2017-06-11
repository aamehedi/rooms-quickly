import { logger } from '../util/logger';
import mongoose from 'mongoose';

const argv = process.argv.slice(2);
const objectId = argv[0];

if (!objectId) {
  logger.debug('Please provide ObjectIDs as command line argument.');
  process.exit(0);
}

import { Room } from'../services/room/model';

let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1)
Room.findByIdAndUpdate(objectId, {$set: {endTime: tomorrow}}).exec()
  .then((room : mongoose.Document) => {
    logger.debug(JSON.stringify(room, null, '\t'));
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(0);
  });
