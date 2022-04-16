import './global.js';
import './check-node-version.js';

import start from './evernode-se-start.js';
import stop from './evernode-se-stop.js';
import reset from './evernode-se-reset.js';
import status from './evernode-se-status.js';
import version from './evernode-se-version.js';
import { get as getConfig } from './evernode-se-config.js';

const config = getConfig();

export default {
  start, stop, reset, status, version, config,
};
