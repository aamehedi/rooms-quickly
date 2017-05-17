import * as mongoose from 'mongoose';
import * as faker from 'faker';

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
  httpOptions: {
    method: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    }
  }
});
const methods : String[] = ["get", "post", "put", "patch"];
/**
 * Statics
 */
PartnerSchema.statics = {
  createFakeInstance: () : mongoose.Document => {
    const partner = new Partner({
      name: faker.name.firstName(),
      token: faker.random.alphaNumeric(32),
      email: faker.internet.email(),
      httpOptions: {
        method: faker.random.arrayElement(methods),
        endpoint: faker.internet.url()
      }
    });
    return partner;
  },
  seed: (numberOfPartners : number = 10) : Promise<mongoose.Document[]> => {
    const partners = [];
    for (let i = 0; i < numberOfPartners; i++) {
      partners.push(PartnerSchema.statics.createFakeInstance());
    }
    return Partner.create(partners);
  }
};

const Partner = mongoose.model('Partner', PartnerSchema);
export {Partner};
