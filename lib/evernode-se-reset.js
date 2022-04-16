import rimraf from 'rimraf';
import { reset as configReset } from './evernode-se-config.js';
import stop from './evernode-se-stop.js';

async function reset(hard) {
  await stop();

  if (hard) {
    rimraf.sync(global.appRoot);
  } else {
    await configReset();
    rimraf.sync(global.appsPath);
  }

  process.stdout.write(`All applications${hard ? ' and data ' : ' '}have been removed. Use 'start' command to start all over again.\n`);
}

export default reset;
