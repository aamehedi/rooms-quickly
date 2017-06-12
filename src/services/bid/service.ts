import * as cote from 'cote';
import { Bid } from './model';
import { logger } from '../../util/logger';

const bidResponder = new cote.Responder({
  name: "bid responder",
  namespace: 'bid',
  respondsTo: ['create', 'show']
});

bidResponder.on('create', (req: any) => {
  logger.debug(req.bid);
  return Bid.create(req.bid);
});

bidResponder.on('show', (req: any) => {
  logger.debug(req.id);
  return Bid.findById(req.id);
});
