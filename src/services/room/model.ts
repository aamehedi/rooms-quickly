import * as mongoose from 'mongoose';
import * as faker from 'faker';
import { connection } from '../../database/db';
import { notify } from '../../util/queue';

(mongoose as any).Promise = global.Promise;

const verifyRoom = (room: mongoose.Document, reject: any) => {
  if (!room) {
    reject(new Error('RoomNotFound'));
  }
};

/**
 * Bid Schema
 */
const BidSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    validate: [
    ]
  }
});
const Bid = mongoose.model('Bid', BidSchema);

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
 * Validators
 */

/**
 * This function is responsible for checking whether the room is active and can
 * accept bid.
 */
const roomIsOpened = (data: any): boolean => {
  return !!data.$parent._doc.endTime;
};

/**
 * This function is responsible for checking whether the room is expired or it
 * is accepting bids.
 */
const roomIsActive = (data: any): boolean => {
  return new Date(data.$parent._doc.endTime) > new Date();
};

/**
 * This function is responsible for checking if the amount of the bid is greater
 * than the minimal allowed bid of the room or not.
 */
const bidIsGreaterThanMinimumBid = (data: any): boolean => {
  return data._doc.amount >= data.$parent._doc.minimalBid;
};

/**
 * This function is responsible for checking if hte amount of hte bid is greater
 * than the amount of the current winner bid by 5% or not.
 */
const bidIsGreaterThanPrevBid = (data: any): boolean => {
  return !data.$parent.oldWinnerBid ||
    data._doc.amount >= data.$parent.oldWinnerBid._doc.amount * 1.05;
};

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
  minimalBid: {
    type: Number,
    required: true
  },
  specialities: [String],
  hotel: {
    type: HotelSchema,
    required: true
  },
  winnerBid: {
    type: BidSchema,
    required: false,
    validate: [
      {
        validator: roomIsOpened,
        message: 'The Room is not opened yet for bidding.',
      },
      {
        validator: roomIsActive,
        message: 'Bidding for this room is expired now. Cannot take any more bids.',
      },
      {
        validator: bidIsGreaterThanMinimumBid,
        message: 'The bid amount is not greater than or equal to the minimal allowed bid.',
      },
      {
        validator: bidIsGreaterThanPrevBid,
        message: 'The bid amount is not greater than old one by 5%.',
      }
    ]
  },
  activeBids: {
    type: [BidSchema],
    required: false
  }
});


/**
 * Hooks
 */

/**
 * This function is responsible for storing a copy of the current winner bid.
 * So that, that copy can be used to compare the old and new amount of winner
 * bid. It is used in the "bidIsGreaterThanPrevBid" validator.
 */
const storeOldwinnerBid = (room: any) => {
  room.oldWinnerBid = room.winnerBid;
};

/**
 * This function is responsible for extending the endtime by 1 minute if there
 * is any last minute bid. If new bid is received less than 1 minute from the
 * end of room auction then auction time is automatically extend by 1 minute
 */
function extendTimeOnLastMinuteBid (next: any) {
  if (this.endTime) {
    const endTime = new Date(this.endTime).getTime();
    const currentTime = Date.now();
    if (endTime - currentTime < 60000) {
      this.endTime = new Date(endTime + 60000);
    }
  }

  next();
}

RoomSchema.post('init', storeOldwinnerBid);
RoomSchema.pre('save', extendTimeOnLastMinuteBid);

/**
 * RoomSchema statics
 */

/**
 * This function is responsible for returing a list of active auction rooms.
 */
const list = (): Promise<mongoose.Document[]> => {
  return Room.find({ endTime: { $gt: new Date() } })
    .sort({ endTime: -1 })
    .lean(true)
    .exec();
};

/**
 * This function is responsible for posting a bid and resolve the bid or reject
 * if there are any error.
 */
const postBid = (id: string, partnerId: string, amount: number) => {
  return Room.findById(id)
    .then((room: any) => {
      return new Promise((resolve: any, reject: any) => {
        verifyRoom(room, reject);

        resolve(room);
      });
    })
    .then((room: any) => {
      return new Promise((resolve: any, reject: any) => {
        const bid = new Bid({ partnerId: partnerId, amount: amount });
        room.winnerBid = bid;
        room.activeBids.unshift(bid);
        room.save()
          .then((savedRoom: any) => {
            return savedRoom.update({
              $pull: {
                activeBids: {
                  _id: { $ne: bid._id },
                  partnerId: partnerId,
                }
              }
            });
          })
          .then(() => {
            // Notify the looser partner
            if (room.winnerBid) {
              notify(room.winnerBid.partnerId, room.winnerBid.id);
            }

            resolve(bid);
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    });
};

/**
 * This function is responsible for listing (accepted/rejected) all bids for a
 * specific room with pagination support. It also ensures no duplicate bids are
 * returned, which means there will be at most 1 bid for each partner.
 */
const listBids = (id: string, skip: number = 0, limit: number = 20): Promise<mongoose.Document[]> => {
  limit = +limit;
  skip = +skip;

  return Room.findOne(
    {
      _id: id
    },
    {
      activeBids:
      {
        $slice: [skip, skip + limit]
      }
    })
    .then((room: any) => {
      return new Promise((resolve: any, reject: any) => {
        verifyRoom(room, reject);

        resolve(room.activeBids);
      });
    });
};

/**
 * This function is responsible for checking a bid and returning a boolean,
 * which indicates whether the bid is a winner or not.
 */
const isWinner = (id: String): Promise<boolean> => {
  return Room.count({
    'winnerBid._id': id
  })
    .then(num => {
      return num > 0;
    });
};

/**
 * This function is responsible for creating a fake instance (Using Faker
 * package) of the Room model.
 */
const createFakeInstance = (): mongoose.Document => {
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
    minimalBid: faker.random.number(100),
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
};

/**
 * This function is responsible for seeding the database with some fake rooms.
 */
const seed = (numberOfRooms: number = 10): Promise<mongoose.Document[]> => {
  const rooms = [];
  for (let i = 0; i < numberOfRooms; i++) {
    rooms.push(RoomSchema.statics.createFakeInstance());
  }

  return Room.create(rooms);
};

RoomSchema.statics.list = list;
RoomSchema.statics.postBid = postBid;
RoomSchema.statics.listBids = listBids;
RoomSchema.statics.isWinner = isWinner;
RoomSchema.statics.createFakeInstance = createFakeInstance;
RoomSchema.statics.seed = seed;

const Room = connection.model('Room', RoomSchema);
export { Room };
