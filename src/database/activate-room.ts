import { logger } from '../util/logger';
import mongoose from 'mongoose';

const argv = process.argv.slice(2);
const objectId = argv[0];

if (!objectId) {
  logger.debug('Please provide ObjectIDs as command line argument.');
  process.exit(0);
}

import { Room } from '../services/room/model';

/**
 * This function is responsible for activiating a room for action. It will
 * activate the room for 10 minutes, starting from currnt time.
 */
const activateRoom = (id: string) => {
  let endTime = new Date();
  endTime = new Date(endTime.getTime() + 10 * 60000);
  Room.findByIdAndUpdate(
    id,
    {
      $set: { endTime: endTime }
    },
    {
      new: true
    })
    .exec()
    .then((room: mongoose.Document) => {
      logger.debug(JSON.stringify(room, null, '\t'));
      process.exit(0);
    })
    .catch((error: any) => {
      logger.error(error);
      process.exit(0);
    });
};

activateRoom(objectId);
