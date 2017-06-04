import * as cote from 'cote';
import { Room } from './model';

const roomResponder = new cote.Responder({
  name: "room responder",
  namespace: 'room',
  respondsTo: ['list']
});

roomResponder.on('list', (req: any) => {
  return Room.schema.statics.list(req.skip, req.limit);
});
