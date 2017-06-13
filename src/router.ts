import * as e from 'express';
import * as cote from 'cote';
import { logger } from './util/logger';
import * as mongooseErrorHandler from 'mongoose-error-handler';

const router = (server: e.Express) => {
  server.all('*', (req: e.Request, _res: e.Response, next) => {
    logger.log(req.method, req.url, req.params);
    next();
  });

  /**
   * @api {get} /rooms Get list of active auction rooms with pagination support.
   * @apiName GetRooms
   * @apiGroup Room
   *
   * @apiDescription Get list of active auction rooms with pagination support.
   *
   * @apiExample {curl} Example usage:
   *   curl -X GET \
   *     http://localhost:5000/rooms \
   *     -H 'cache-control: no-cache' \
   *     -H 'content-type: application/json' \
   *
   * @apiSuccess {Object[]} rooms List of active auction rooms.
   * @apiSuccess {String} rooms._id Id of the room.
   * @apiSuccess {String} rooms.name Name of the room.
   * @apiSuccess {String} rooms.description Description of the room.
   * @apiSuccess {Date} rooms.endTime Auction end time for this room.
   * @apiSuccess {Number} rooms.minimalBid Minimal allowed bid of the room.
   *
   * @apiSuccess {Object} rooms.hotel Hotel information of the room.
   * @apiSuccess {String} rooms.hotel.name Name of the hotel.
   * @apiSuccess {String} rooms.hotel.phone Phone number of the hotel.
   * @apiSuccess {String} rooms.hotel.email Email number of the hotel.
   *
   * @apiSuccess {Object} rooms.hotel.address Address information of the hotel.
   * @apiSuccess {String} rooms.hotel.address.streetAddress Street address of the hotel.
   * @apiSuccess {String} rooms.hotel.address.zipCode Zip code of the hotel.
   * @apiSuccess {String} rooms.hotel.address.city City of the hotel.
   * @apiSuccess {String} rooms.hotel.address.state State of the hotel.
   * @apiSuccess {String} rooms.hotel.address.country Country of the hotel.
   *
   * @apiSuccess {Object} rooms.winnerBid Winner bid information of the room.
   * @apiSuccess {String} rooms.winnerBid._id Id of the winner bid of the room.
   * @apiSuccess {Number} rooms.winnerBid.amount Amount of the winner bid of the room.
   * @apiSuccess {String} rooms.winnerBid.parnerId Partner ID of the winner bid of the room.
   *
   * @apiSuccess {Object[]} rooms.activeBids Active bids information of the room.
   * @apiSuccess {String} rooms.activeBids._id Active bid id of the room.
   * @apiSuccess {Number} rooms.activeBids.amount Amount of the active bid id of the room.
   * @apiSuccess {String} rooms.activeBids.partnerId Partner ID of the active bid id of the room.
   *
   * @apiSuccess {String[]} rooms.specialities Specialities of the room.
   * @apiSuccess {Number} rooms.children Maximum number of children can accomodate in the room.
   * @apiSuccess {Number} rooms.adults Maximum number of adults can accomodate in the room.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [
   *         {
   *             "_id": "593c4f008a942f021199fb5e",
   *             "name": "Schinner - Ziemann",
   *             "description": "Et eum consectetur nihil ab. Corrupti nihil neque qui provident maiores doloribus.
   *                  At consequatur ratione et molestias deserunt mollitia molestiae quae dolor. Pariatur dicta
   *                  consequatur. Explicabo qui doloremque quia ut.\n \rQui autem ex neque laborum asperiores placeat.
   *                  Ea expedita officia explicabo blanditiis architecto ducimus. Tenetur ut non sit facilis excepturi
   *                  dolorum. Animi necessitatibus sed debitis repudiandae. Rem rerum accusantium consequatur quaerat
   *                  quae est omnis reiciendis.\n \rEt beatae distinctio. Qui eum et quisquam. Enim eos non minima
   *                  ratione. Optio ipsum sint impedit voluptatem aliquid fugiat. Ut laudantium eos.",
   *             "endTime": "2017-06-13T15:49:03.969Z",
   *             "minimalBid": 91,
   *             "hotel": {
   *                 "name": "Anderson Inc",
   *                 "phone": "975.736.5685 x7816",
   *                 "email": "Desmond_Steuber@yahoo.com",
   *                 "_id": "593c4f008a942f021199fb5f",
   *                 "address": {
   *                     "streetAddress": "787 Gusikowski Ranch",
   *                     "zipCode": "45568-7106",
   *                     "city": "New Stephaniachester",
   *                     "state": "North Carolina",
   *                     "country": "Morocco"
   *                 }
   *             },
   *             "__v": 27,
   *             "winnerBid": {
   *                 "amount": 450,
   *                 "partnerId": "593c4f008a942f021199fb72",
   *                 "_id": "593ec7d46533501b04d388da"
   *             },
   *             "activeBids": [
   *                 {
   *                     "_id": "593ec7d46533501b04d388da",
   *                     "amount": 450,
   *                     "partnerId": "593c4f008a942f021199fb72"
   *                 }
   *             ],
   *             "specialities": [
   *                 "et",
   *                 "quia",
   *                 "commodi",
   *                 "amet",
   *                 "voluptatem",
   *                 "earum",
   *                 "perspiciatis"
   *             ],
   *             "children": 10,
   *             "adults": 8
   *         }
   *     ]
   */
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

  /**
   * @api {post} /rooms/:id/bid Post a bid to a specific room.
   * @apiName PostBid
   * @apiGroup Room
   *
   * @apiDescription Post a bid to a specific room.
   *
   * @apiExample {curl} Example usage:
   *     curl -X POST \
   *       http://localhost:5000/rooms/593c4f008a942f021199fb5e/bid \
   *       -H 'cache-control: no-cache' \
   *       -H 'content-type: application/json' \
   *       -d '{
   *       "bid": {
   *         "partnerId": "593c4f008a942f021199fb72",
   *         "amount": 480
   *       }
   *     }'
   *
   * @apiSuccess {Boolean} success Indicates whetther posting the bid is a success or fail.
   * @apiSuccess {Object} bid The bid information that have been posted.
   * @apiSuccess {String} bid._id Id of the bid.
   * @apiSuccess {Number} bid.amount Amount of the bid.
   * @apiSuccess {String} bid.roomId The id of the room of the bid.
   * @apiSuccess {String} bid.partnerId The id of the partner of the bid.
   *
   * @apiSuccessExample {json} Success-Response:
   *    {
   *        "success": true,
   *        "bid": {
   *            "partnerId": "593c4f008a942f021199fb72",
   *            "amount": 480,
   *            "_id": "594012080c49992acad14477",
   *            "roomId": "593c4f008a942f021199fb5e"
   *        }
   *    }
   *
   * @apiError {Boolean} success Indicates whetther posting the bid is a success or fail.
   * @apiError {Object} msg The message information from the error response.
   * @apiError {Objecet} msg.errors Errors that occured.
   * @apiError {String} msg.errors.winnerBid The error message.
   *
   * @apiErrorExample {json} Error-Response:
   *    {
   *        "success": false,
   *        "msg": {
   *            "errors": {
   *                "winnerBid": "Bidding for this room is expired now. Cannot take any more bids."
   *            }
   *        }
   *    }
   */
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
              msg: {
                errors: {
                  room: 'No room is found with the specified room id.'
                }
              }
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

  /**
   * @api {get} /rooms/:id/bids/:skip?/:limit? Get list of active bids for a specific room.
   * @apiName GetBids
   * @apiGroup Room
   *
   * @apiDescription Get list of active bids for a specific room.
   *
   * @apiExample {curl} Example usage:
   *    curl -X GET \
   *      http://localhost:5000/rooms/593c4f008a942f021199fb5e/bids/1/2 \
   *      -H 'cache-control: no-cache' \
   *      -H 'content-type: application/json' \
   *
   * @apiSuccess {Boolean} success Indicates whetther the request is a success or fail.
   * @apiSuccess {Object[]} bids List of active bids.
   * @apiSuccess {String} bid._id Id of the bid.
   * @apiSuccess {Number} bid.amount Amount of the bid.
   * @apiSuccess {String} bid.partnerId The id of the partner of the bid.
   *
   * @apiSuccessExample {json} Success-Response:
  *     {
   *         "success": true,
   *         "bids": [
   *             {
   *                 "_id": "594018710824d765a34152e6",
   *                 "amount": 600,
   *                 "partnerId": "593c4f008a942f021199fb6f"
   *             },
   *             {
   *                 "_id": "594012080c49992acad14477",
   *                 "amount": 480,
   *                 "partnerId": "593c4f008a942f021199fb72"
   *             }
   *         ]
   *     }
   *
   * @apiError {Boolean} success Indicates whetther the request is a success or fail.
   * @apiError {String} msg The message from the error response.
   *
   * @apiErrorExample {json} Error-Response:
   *     {
   *         "success": false,
   *         "msg": "Some error have been occured in the server"
   *     }
   */
  server.get('/rooms/:id/bids/:skip?/:limit?', (req: e.Request, res: e.Response) => {
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
              msg: 'Some error have been occured in the server'
            });
          logger.error(JSON.stringify(error, null, '\t'));
        }
      });
  });

  /**
   * @api {get} /bids/:id Show information of a bid.
   * @apiName GetBid
   * @apiGroup Bid
   *
   * @apiDescription Show information of a bid.
   *
   * @apiExample {curl} Example usage:
   *    curl -X GET \
   *      http://localhost:5000/bids/593e8cb99190921504b8d4e4 \
   *      -H 'cache-control: no-cache' \
   *      -H 'content-type: application/json' \
   *
   * @apiSuccess {Boolean} success Indicates whetther the request is a success or fail.
   * @apiSuccess {Object} bid Information of the bid.
   * @apiSuccess {String} bid._id Id of the bid.
   * @apiSuccess {Number} bid.amount Amount of the bid.
   * @apiSuccess {String} bid.roomId The id of the room of the bid.
   * @apiSuccess {String} bid.partnerId The id of the partner of the bid.
   * @apiSuccess {Boolean} bid.winner Indicates if the bid is a winner.
   *
   * @apiSuccessExample {json} Success-Response:
   *    {
   *        "success": true,
   *        "bid": {
   *            "_id": "593e8cb99190921504b8d4e4",
   *            "partnerId": "593c4f008a942f021199fb72",
   *            "amount": 350,
   *            "roomId": "593c4f008a942f021199fb5e",
   *            "__v": 0,
   *            "winner": false
   *        }
   *    }
   *
   * @apiError {Boolean} success Indicates whetther the request is a success or fail.
   * @apiError {String} msg The message from the error response.
   *
   * @apiErrorExample {json} Error-Response:
   *    {
   *        "success": false,
   *        "msg": "No bid have been found with the specified id."
   *    }
   */
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
