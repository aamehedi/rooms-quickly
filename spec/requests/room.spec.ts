/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
import * as chaiHttp from 'chai-http';
import * as chaiArrays from 'chai-arrays';
import * as mongoose from 'mongoose';
import * as config from 'config';
import { logger, configuration } from '../../src/util/logger';
import { Room } from '../../src/services/room/model';
import { seed } from '../../src/util/seedUtil';
import { activateRoom } from '../../src/util/activateRoomUtil';

process.env.NODE_ENV = 'test';
const chai = require('chai');
const url = `${config.get('baseUrl')}:${config.get('port')}`;

logger.debug(url);
logger.configure(configuration(`${__dirname}/../../logs/spec/`));
chai.should();
chai.config.truncateThreshold = 0;
chai.use(chaiHttp);
chai.use(chaiArrays);

describe('Room', () => {
  before(() => {
    return seed(10, 5, (docs: mongoose.Document[], modelName: string) => {
      logger.debug(`${modelName}s have been created in the database.`);
      this[`${modelName.toLowerCase()}s`] = docs;
    })
      .then(() => {
        const log = (room: mongoose.Document) => {
          logger.debug(`Rooms with id ${room._id} have been activated`);
        };
        const roomPromises: Promise<any>[] = [];
        for (var index = 0; index < 5; index++) {
          roomPromises.push(activateRoom(this.rooms[index]._id, log));
        }

        return Promise.all(roomPromises);
      })
      .then(() => {
        return Room.schema
          .statics
          .list();
      })
      .then((rooms: any) => {
        logger.debug(rooms.length);
        this.activatedRooms = [];
        for (var index = 0; index < rooms.length; index++) {
          this.activatedRooms.push(JSON.parse(JSON.stringify(rooms[index])));
        }
      })
      .then(() => {
        return Room.find({endTime: null})
          .lean(true);
      })
      .then((rooms: mongoose.Document[]) => {
        this.rooms = rooms;

        let pastTime = new Date();
        pastTime = new Date(pastTime.getTime() - 100 * 60000);
        const room = this.rooms[4];
        return Room.findByIdAndUpdate(
          room._id,
          { endTime: pastTime }
        ).exec();
      })
      .catch((error: any) => {
        logger.error(error);
        process.exit(0);
      });
  });

  describe('GET /rooms', () => {
    before(() => {
      return chai.request(url)
        .get('/rooms')
        .then((res: any) => {
          this.response = res;
        });
    });

    it('should have status 200', () => {
      return this.response.should.have.status(200);
    });

    it('should return an array', () => {
      return this.response.body.should.be.array();
    });

    it('should return an array of size 5', () => {
      return this.response.body.should.be.ofSize(5);
    });

    it('should return an array of activated rooms', () => {
      return this.response.body.should.be.deep.equal(this.activatedRooms);
    });

    it('should be sorted by endtime at descending order', () => {
      return this.response.body.should.be.sorted((prev: any, next: any) => {
        return new Date(prev.endTime).getTime() < new Date(next.endTime).getTime();
      });
    });
  });

  describe('Post /rooms/:id/bid Success Case', () => {
    before(() => {
      const room = this.activatedRooms[0];
      this.data = {
        bid: {
          partnerId: this.partners[0]._id.toString(),
          amount: room.minimalBid
        }
      };

      return chai.request(url)
        .post(`/rooms/${room._id}/bid`)
        .send(this.data)
        .then((res: any) => {
          this.response = res;
        });
    });

    it('should have status 200', () => {
      return this.response.should.have.status(200);
    });

    it('should respond with success', () => {
      this.response.body.should.have.property('success');
      this.response.body.success.should.be.a('boolean');
      return this.response.body.success.should.be.eql(true);
    });

    it('should respond with the bid object', () => {
      this.response.body.should.have.property('bid');
      this.response.body.bid.should.be.a('object');
      this.response.body.bid.should.have.property('_id');
      this.response.body.bid._id.should.be.a('string');
      const data = {
        success: true,
        bid: {
          _id: this.response.body.bid._id,
          amount: this.data.bid.amount,
          partnerId: this.data.bid.partnerId,
          roomId: this.activatedRooms[0]._id
        }
      };
      return this.response.body.should.be.deep.equal(data);
    });
  });

  describe('Post /rooms/:id/bid Failed Case', () => {
    it('posting to an inactive room must fail', () => {
      const room = this.rooms[0];
      this.data = {
        bid: {
          partnerId: this.partners[0]._id.toString(),
          amount: room.minimalBid * 1.05 + 1
        }
      };

      return chai.request(url)
        .post(`/rooms/${room._id}/bid`)
        .send(this.data)
        .catch((error: any) => {
          error.should.have.status(400);
          error.response.body.should.have.property('success');
          error.response.body.success.should.be.eql(false);
          error.response.body.should.have.property('msg');
          error.response.body.msg.should.have.property('errors');
          error.response.body.msg.errors.should.have.property('winnerBid');
          error.response.body.msg.errors.winnerBid.should.be.a('string');
          return error.response.body.msg.errors.winnerBid.should.be
            .eql('The Room is not opened yet for bidding.');
        });
    });

    it('posting to an expired room must fail', () => {
      const room = this.rooms[4];
      this.data = {
        bid: {
          partnerId: this.partners[0]._id.toString(),
          amount: room.minimalBid
        }
      };

      return chai.request(url)
        .post(`/rooms/${room._id}/bid`)
        .send(this.data)
        .catch((error: any) => {
          error.response.should.have.status(400);
          error.response.body.should.have.property('success');
          error.response.body.success.should.be.eql(false);
          error.response.body.should.have.property('msg');
          error.response.body.msg.should.have.property('errors');
          error.response.body.msg.errors.should.have.property('winnerBid');
          error.response.body.msg.errors.winnerBid.should.be.a('string');
          return error.response.body.msg.errors.winnerBid.should.be
            .eql('Bidding for this room is expired now. Cannot take any more bids.');
        });
    });

    it('posting a bid less than minimal bid amount must fail', () => {
      const room = this.activatedRooms[0];
      this.data = {
        bid: {
          partnerId: this.partners[0]._id.toString(),
          amount: room.minimalBid - 10
        }
      };

      return chai.request(url)
        .post(`/rooms/${room._id}/bid`)
        .send(this.data)
        .catch((error: any) => {
          error.should.have.status(400);
          error.response.body.should.have.property('success');
          error.response.body.success.should.be.eql(false);
          error.response.body.should.have.property('msg');
          error.response.body.msg.should.have.property('errors');
          error.response.body.msg.errors.should.have.property('winnerBid');
          error.response.body.msg.errors.winnerBid.should.be.a('string');
          return error.response.body.msg.errors.winnerBid.should.be
            .eql('The bid amount is not greater than or equal to the minimal allowed bid.');
        });
    });

  });
});
