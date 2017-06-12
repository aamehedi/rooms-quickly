import * as cote from 'cote';
import { Room } from './model';

const roomResponder = new cote.Responder({
  name: "room responder",
  namespace: 'room',
  respondsTo: ['list', 'post_bid']
});

roomResponder.on('list', (req: any) => {
  return Room.schema.statics.list(req.skip, req.limit);
});

roomResponder.on('post_bid', (req: any) => {
  return Room.schema.statics.postBid(req.roomId, req.bid.partnerId, req.bid.amount);
});
