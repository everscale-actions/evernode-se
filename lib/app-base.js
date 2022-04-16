import start from './app-base-start.js';
import stop from './app-base-stop.js';
import status from './app-base-status.js';

export default (config) => ({
  start: () => start(config),
  stop: () => stop(config),
  status: () => status(config),
});
