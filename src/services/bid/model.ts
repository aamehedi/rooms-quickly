import * as mongoose from 'mongoose';
import { connection } from '../../database/db';

(mongoose as any).Promise = global.Promise;
/**
 * Bid Schema
 */
const BidSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Bid = connection.model('Bid', BidSchema);
export { Bid };
