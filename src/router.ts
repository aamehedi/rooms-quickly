import * as e from 'express';
import * as cote from 'cote';
import { logger } from './util/logger';
import * as mongooseErrorHandler from 'mongoose-error-handler';

const router = (server: e.Express) => {
  server.all('*', (req: e.Request, _res: e.Response, next) => {
    logger.log(req.method, req.url, req.params);
    next();
  });

  server.get('/', (_req, res) => {
    res.send('Hi');
  });

  server.get('/rooms', (req: e.Request, res: e.Response) => {
    roomRequester.send({
      type: 'list', skip: req.query.skip,
      limit: req.query.limit
    })
      .then((rooms: any) => {
        res.send(rooms);
      })
      .catch((error: Error) => {
        logger.error(JSON.stringify(error, null, '\t'));
      });
  });

  server.post('/rooms/:id/bid', (req: e.Request, res: e.Response) => {
    roomRequester.send({
      type: 'postBid', id: req.params.id,
      bid: req.body.bid
    })
      .then((bid: any) => {
        Object.assign(bid, { roomId: req.params.id });
        bidRequester.send({
          type: 'create',
          bid: bid
        })
          .catch((error: Error) => {
            logger.error(JSON.stringify(error, null, '\t'));
          });

        res.json({
          success: true,
          bid: bid
        });
      })
      .catch((error: any) => {
        logger.error(error);
        if (error.name === 'RoomNotFound') {
          res.status(404)
            .json({
              success: false,
              msg: 'No room is found with the specified room id.'
            });
        } else if (error.name === 'ValidationError') {
          res.status(400)
            .json({
              success: false,
              msg: mongooseErrorHandler.set(error)
            });
        } else {
          res.status(500)
            .json({
              success: false,
              msg: mongooseErrorHandler.set(error)
            });
        }
      });
  });

  server.get('/rooms/:id/bids', (req: e.Request, res: e.Response) => {
    roomRequester.send({
      type: 'listBids',
      id: req.params.id,
      skip: req.params.skip,
      limit: req.params.limit
    })
      .then((bids: Array<any>) => {
        res.json({
          success: true,
          bids: bids
        });
      })
      .catch((error: Error) => {
        if (error.name === 'RoomNotFound') {
          res.status(404)
            .json({
              success: false,
              msg: 'No room is found with the specified room id.'
            });
        } else {
          res.status(503)
            .json({
              success: false,
              msg: 'Some error have been occured in the server',
              error: error
            });
        }
      });
  });

  server.get('/bids/:id', (req: e.Request, res: e.Response) => {
    bidRequester.send({
      type: 'show',
      id: req.params.id
    })
      .then((bid: any) => {
        roomRequester.send({
          type: 'checkWinner',
          id: bid._id
        })
          .then((isWinner: boolean) => {
            Object.assign(bid, { winner: isWinner });
            res.send({
              success: true,
              bid: bid
            });
          })
          .catch((error: Error) => {
            logger.error(JSON.stringify(error, null, '\t'));
            res.status(503)
              .json({
                success: false,
                error: error
              });
          });
      }).catch((error: Error) => {
        logger.error(JSON.stringify(error, null, '\t'));
        res.status(404)
          .json({
            success: false,
            msg: 'No bid have been found with the specified id.'
          });
      });
  });

  const roomRequester = new cote.Requester({
    name: 'room requester',
    namespace: 'room'
  });

  const bidRequester = new cote.Requester({
    name: 'bid requester',
    namespace: 'bid'
  });
};

export { router };
