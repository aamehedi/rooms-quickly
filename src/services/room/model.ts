import * as mongoose from 'mongoose';
import * as faker from 'faker';
import { logger, configuration } from '../../util/logger'
import { db } from '../../database/db';

logger.configure(configuration(`${__dirname}/../../../../logs/room/`));
(mongoose as any).Promise = global.Promise;

/**
 * Hotel Schema
 */
const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    streetAddress: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: true
    }
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  fax: {
    type: String
  },
  website: {
    type: String
  }
});
/**
 * Room Schema
 */
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  endTime: {
    type: Date
  },
  adults: {
    type: Number,
    required: true,
    default: 1
  },
  children: {
    type: Number,
    required: true,
    default: 0
  },
  specialities: [String],
  hotel: {
    type: HotelSchema,
    required: true
  }
});
/**
 * Statics mongoose
 */
RoomSchema.statics = {
  list: (skip: number = 0, limit: number = 20) : Promise<mongoose.Document[]> => {
    return db.then(() => {
      return Room.find({endTime: {$gt: new Date()}})
      .sort({endTime: -1})
      .skip(skip)
      .limit(limit);
    });
  },
  createFakeInstance: () : mongoose.Document => {
    const specialities = [];
    const length = faker.random.number(10);
    for (var i = 0; i < length; i++) {
      specialities.push(faker.lorem.word());
    }
    const room = new Room({
      name: faker.company.companyName(),
      description: faker.lorem.paragraphs(),
      endTime: null,
      adults: faker.random.number(10),
      children: faker.random.number(10),
      specialities: specialities,
      hotel: {
        name: faker.company.companyName(),
        address: {
          streetAddress: faker.address.streetAddress(),
          zipCode: faker.address.zipCode(),
          city: faker.address.city(),
          state: faker.address.state(),
          country: faker.address.country()
        },
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email()
      }
    });
    return room;
  },

  seed: (numberOfRooms : number = 10) : Promise<mongoose.Document[]> => {
    const rooms = [];
    for (let i = 0; i < numberOfRooms; i++) {
      rooms.push(RoomSchema.statics.createFakeInstance());
    }
    return Room.create(rooms);
  }
};

const Room = mongoose.model('Room', RoomSchema);
export {Room};
