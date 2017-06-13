import * as kue from "kue";
import { Partner } from "../services/partner/model";
import { logger } from './logger';
import * as config from 'config';

/**
 * This function is responsible for logging different events (currently
 * "ready", "error", "job enqueue", "job start", "job failed attempt" and
 * "job failed") of the kue.Queue instance.
 */
const logQueue = (queue: kue.Queue) => {
  queue.on("ready", () => {
    logger.info("Queue is ready!!");
  })
    .on("error", (error: Error) => {
      logger.error(JSON.stringify(error, null, '\t'));
    })
    .on("job enqueue", (id: any) => {
      logger.info(`job_id: ${id}, status: enquued`);
    })
    .on("job start", (id: any) => {
      logger.info(`job_id: ${id}, status: started`);
    })
    .on("job failed attempt", (id: any, errorMessage: any, doneAttempts: any) => {
      logger.info(`job_id: ${id}, status: Job failed after ${doneAttempts}
attempts, errorMessage: ${errorMessage}`);
    })
    .on("job failed", (id: any, errorMessage: any) => {
      logger.info(`job_id: ${id}, status: Job has failed and has no remaining
attempts, errorMessage: ${errorMessage}`);
    });
};

/**
 * This function is responsible for creating a background job in Queue instance
 * so that it later sends notifaction to partners regarding their lost bids.
 */
const notify = (partnerId: String, bidId: String) => {
  if (partnerId && bidId) {
    queue.create("notify",
      {
        partnerId: partnerId,
        bidId: bidId
      })
      .priority("normal")
      .attempts(5)
      .backoff(true)
      .removeOnComplete(false)
      .save((error: any) => {
        if (error) {
          logger.error(JSON.stringify(error, null, '\t'));
        }
      });
  }
};

const queue = kue.createQueue({
  jobEvents: false,
  redis: config.get('redisURL')
});

logQueue(queue);

queue.process("notify", 20, (job: kue.Job, done: any) => {
  Partner.schema
    .statics
    .notify(job.data.partnerId, job.data.bidId)
    .then((response: any) => {
      logger.debug(response);
      done();
    })
    .catch((err: Error) => {
      logger.error(JSON.stringify(err, null, '\t'));
    });
});

export { notify };
