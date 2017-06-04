import * as cote from 'cote';
import { logger } from './logger'

const monitor = new cote.MonitoringTool();
if (monitor) {
  logger.debug(`Cote monitor have been started.`);
}
