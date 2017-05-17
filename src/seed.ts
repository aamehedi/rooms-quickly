import { Room } from './services/room/model';
import { Partner } from './services/partner/model';
import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger } from './logger';
(mongoose as any).Promise = global.Promise;

Room.remove({}).exec()
  .then(() => {
    logger.debug("Existing rooms have been removed from the database.");
    return Room.schema.statics.seed(config.get('seed.number_of_rooms'));
  })
  .then((rooms: mongoose.Model<mongoose.Document>[]) => {
    logger.debug("Rooms have been created in the database.");
    rooms.forEach(room => {
      logger.info(JSON.stringify(room, null, '\t'));
    });
    return Partner.remove({}).exec();
  })
  .then(() => {
    logger.debug("Existing partners have been removed from the database.");
    return Partner.schema.statics.seed(config.get('seed.number_of_partners'));
  })
  .then((partners: mongoose.Model<mongoose.Document>[]) => {
    logger.debug("Partners have been created in the database.");
    partners.forEach(partner => {
      logger.info(JSON.stringify(partner, null, '\t'));
    });
  }).catch((err) => {
    return this.done(logger.error(err.stack));
  });
