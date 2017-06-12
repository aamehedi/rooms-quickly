import * as cote from 'cote';
import { Room } from './model';

const roomResponder = new cote.Responder({
  name: "room responder",
  namespace: 'room',
  respondsTo: ['list', 'postBid', 'listBids', 'checkWinner']
});

roomResponder.on('list', (req: any) => {
  return Room.schema
    .statics
    .list(req.skip, req.limit);
});

roomResponder.on('postBid', (req: any) => {
  return Room.schema
    .statics
    .postBid(req.id, req.bid.partnerId, req.bid.amount);
});

roomResponder.on('listBids', (req: any) => {
  return Room.schema
    .statics
    .listBids(req.id, req.skip, req.limit);
});

roomResponder.on('checkWinner', (req: any) => {
  return Room.schema
    .statics
    .isWinner(req.id);
});
