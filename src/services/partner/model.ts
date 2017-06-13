import * as mongoose from 'mongoose';
import * as faker from 'faker';
import { connection } from '../../database/db';
import * as http from "http";

(mongoose as any).Promise = global.Promise;

/**
 * Partner Schema
 */
const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  httpEndpoint: {
    type: String,
    required: true
  }
});

/**
 * Partner statics
 */

/**
 * This function is responsible for sending notifcation to partners while there
 * bid is no longer a winner via http request to their API.
 */
const notify = (parntnerId: string, bidId: string): Promise<any> => {
  return Partner.findById(parntnerId)
    .then((partner: any) => {
      return new Promise((resolve: any, reject: any) => {
        http.request(
          `${partner.httpEndpoint}?bidId=${bidId}`,
          function (response: any) {
            resolve(response);
          })
          .on("error", (error: Error) => {
            reject(error);
          })
          .end();
      });
    });
};

/**
 * This function is responsible for creating a fake instance (Using Faker
 * package) of the Partner model.
 */
const createFakeInstance = (): mongoose.Document => {
  const partner = new Partner({
    name: faker.name.firstName(),
    token: faker.random.alphaNumeric(32),
    email: faker.internet.email(),
    httpEndpoint: faker.internet.url()
  });

  return partner;
};

/**
 * This function is responsible for seeding the database with some fake partners.
 */
const seed = (numberOfPartners: number = 10): Promise<mongoose.Document[]> => {
  const partners = [];
  for (let i = 0; i < numberOfPartners; i++) {
    partners.push(PartnerSchema.statics.createFakeInstance());
  }

  return Partner.create(partners);
};

PartnerSchema.statics.notify = notify;
PartnerSchema.statics.createFakeInstance = createFakeInstance;
PartnerSchema.statics.seed = seed;

const Partner = connection.model('Partner', PartnerSchema);
export { Partner };
