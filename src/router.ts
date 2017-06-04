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

  server.get('/rooms', (req: express.Request, res: express.Response) => {
    roomRequester.send({type: 'list', skip: req.query.skip, limit: req.query.limit})
      .then((rooms: any) => {
        res.send(rooms);
      })
      .catch((err: Error) => {logger.error(JSON.stringify(err, null, '\t'))});
  });

  const roomRequester = new cote.Requester({
    name: 'room requester',
    namespace: 'room'
  });
};

export {router};
