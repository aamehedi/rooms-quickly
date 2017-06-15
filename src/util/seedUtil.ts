import { Room } from '../services/room/model';
import { Partner } from '../services/partner/model';
import * as mongoose from 'mongoose';
import { logger } from '../util/logger';

/**
 * This function is responsible for seeding a number of rooms and partners in
 * the mongoose document and calling the 'processDocs' callback which accepts 2
 * parameters (docs and modelName) when data returned from the database.
 */
const seed = (numberOfRooms: number, numberOfPartners: number, processDocs: any): Promise<any> => {
  return Room.remove({})
    .exec()
    .then(() => {
      logger.debug("Existing rooms have been removed from the database.");

      return Room.schema
        .statics
        .seed(numberOfRooms);
    })
    .then((rooms: mongoose.Model<mongoose.Document>[]) => {
      processDocs(rooms, 'Room');

      return Partner.remove({}).exec();
    })
    .then(() => {
      logger.debug("Existing partners have been removed from the database.");

      return Partner.schema
        .statics
        .seed(numberOfPartners);
    })
    .then((partners: mongoose.Model<mongoose.Document>[]) => {
      processDocs(partners, 'Partner');
    });
};

export { seed };
