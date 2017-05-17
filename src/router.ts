import * as express from 'express';
import * as cote from 'cote';
import { logger } from './util/logger';

const router = (server : express.Express) => {
  server.all('*', (req : express.Request, _res : express.Response, next) => {
    logger.log(req.method, req.url, req.params);
    next();
  });

  server.get('/', (_req, res) => {
    res.send('Hi');
  })

  server.get('/rooms', (_req: express.Request, res: express.Response) => {
    roomRequester.send({type: 'list'}, (err: Error, rooms: Array<any>) => {
      if (err) {
        logger.error(JSON.stringify(err, null, '\t'));
      } else {
        res.send(rooms);
      }
    });
  });

  const roomRequester = new cote.Requester({
    name: 'room requester',
    namespace: 'room'
  });
};

export {router};
