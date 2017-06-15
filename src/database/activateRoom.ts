import { logger } from '../util/logger';
import mongoose from 'mongoose';

const argv = process.argv.slice(2);
const objectId = argv[0];

if (!objectId) {
  logger.debug('Please provide ObjectIDs as command line argument.');
  process.exit(0);
}

import { activateRoom } from '../util/activateRoomUtil';

activateRoom(objectId, (room: mongoose.Document) => {
    logger.info(JSON.stringify(room, null, '\t'));
    process.exit(0);
  })
  .catch((error: any) => {
    logger.error(error);
    process.exit(0);
  });
