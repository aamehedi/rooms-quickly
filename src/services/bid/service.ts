import * as cote from 'cote';
import { Bid } from './model';
import { logger } from '../../util/logger';

const bidResponder = new cote.Responder({
  name: "bid responder",
  namespace: 'bid',
  respondsTo: ['create']
});

bidResponder.on('create', (req: any) => {
  logger.debug(req.bid);
  return Bid.create(req.bid);
});
