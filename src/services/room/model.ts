import * as mongoose from 'mongoose';
import * as faker from 'faker';
import { connection } from '../../database/db';
import { notify } from '../../util/queue';

(mongoose as any).Promise = global.Promise;

const verifyRoom = (room: any, reject: any) => {
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
    validate: [{
      validator: (data: any): boolean => {
        return !!data.$parent._doc.endTime;
      },
      message: 'The Room is not opened yet for bidding.',
    }, {
      validator: (data: any): boolean => {
        return new Date(data.$parent._doc.endTime) > new Date();
      },
      message: 'The Room is closed now. Cannot take any more bids.'
    }, {
      validator: (data: any): boolean => {
        return data._doc.amount >= data.$parent._doc.minimalBid;
      },
      message: 'The bid amount is not greater than or equal to the minimal allowed bid.'
    }, {
      validator: (data: any): boolean => {
        return !data.$parent.oldWinnerBid ||
          data._doc.amount >= data.$parent.oldWinnerBid._doc.amount * 1.05;
      },
      message: 'The bid amount is not greater than old one by 5%.',
    }]
  },
  activeBids: {
    type: [BidSchema],
    required: false
  }
});

/**
 * Hooks
 */
RoomSchema.post('init', (room: any) => {
  room.oldWinnerBid = room.winnerBid;
});

RoomSchema.pre('save', function (next: any) {
  if (this.endTime) {
    const endTime = new Date(this.endTime).getTime();
    const currentTime = Date.now();
    if (endTime - currentTime < 60000) {
      this.endTime = new Date(endTime + 60000);
    }
  }

  next();
});

/**
 * Statics mongoose
 */
RoomSchema.statics = {
  list: (skip: number = 0, limit: number = 20): Promise<mongoose.Document[]> => {
    return Room.find({ endTime: { $gt: new Date() } })
      .sort({ endTime: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  postBid: (id: string, partnerId: string, amount: number) => {
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
  },

  listBids: (id: string, skip: number = 0, limit: number = 20): Promise<mongoose.Document[]> => {
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
  },

  isWinner: (id: String): Promise<boolean> => {
    return Room.count({
      'winnerBid._id': id
    })
      .then(num => {
        return num > 0;
      });
  },

  createFakeInstance: (): mongoose.Document => {
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
  },

  seed: (numberOfRooms: number = 10): Promise<mongoose.Document[]> => {
    const rooms = [];
    for (let i = 0; i < numberOfRooms; i++) {
      rooms.push(RoomSchema.statics.createFakeInstance());
    }

    return Room.create(rooms);
  }
};

const Room = connection.model('Room', RoomSchema);
export { Room };
