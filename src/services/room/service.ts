import * as cote from 'cote';
import { Room } from './model';

const roomResponder = new cote.Responder({
  name: "room responder",
  namespace: 'room',
  respondsTo: ['list', 'postBid']
});

roomResponder.on('list', (req: any) => {
  return Room.schema.statics.list(req.skip, req.limit);
});

roomResponder.on('postBid', (req: any) => {
  return Room.schema.statics.postBid(req.roomId, req.bid.partnerId, req.bid.amount);
});

roomResponder.on('checkWinner', (req: any) => {
  return Room.schema.statics.isWinner(req.id);
});
