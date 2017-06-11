import * as express from 'express';
import * as cote from 'cote';
import { logger } from './util/logger';
import * as mongooseErrorHandler from 'mongoose-error-handler';

const router = (server : express.Express) => {
  server.all('*', (req : express.Request, _res : express.Response, next) => {
    logger.log(req.method, req.url, req.params);
    next();
  });

  server.get('/', (_req, res) => {
    res.send('Hi');
  })

  server.get('/rooms', (req: express.Request, res: express.Response) => {
    roomRequester.send({type: 'list', skip: req.query.skip, limit: req.query.limit})
      .then((rooms: any) => {
        res.send(rooms);
      })
      .catch((err: Error) => {logger.error(JSON.stringify(err, null, '\t'))});
  });

  server.post('/rooms/:roomId/bid', (req: express.Request, res: express.Response) => {
    roomRequester.send({type: 'post_bid', roomId: req.params.roomId, bid: req.body.bid})
      .then((bid: any) => {
        logger.debug(bid);
        res.json({success: true, bid: bid});
      })
      .catch((error: any) => {
        logger.error(error);
        if (error.name === "RoomNotFound") {
          res.status(404).json({ success: false, msg: "No room is found with the specified room id."});
        } else if (error.name === "ValidationError") {
          res.status(400).json({success: false, msg: mongooseErrorHandler.set(error)});
        } else {
          res.status(500).json({ success: false, msg: mongooseErrorHandler.set(error)});
        }
      });
  });

  const roomRequester = new cote.Requester({
    name: 'room requester',
    namespace: 'room'
  });
};

export {router};
