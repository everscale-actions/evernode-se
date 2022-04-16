import { existsSync } from 'fs';
import appsPool from './apps/apps-pool.js';

async function stop() {
  if (!existsSync(global.appsPath)) {
    process.stdout.write('Nothing to stop. Use \'start\' command to start installation process and run all applications\n');
    return;
  }

  const reversedAppsPool = appsPool.slice().reverse();
  for (let i = 0; i < reversedAppsPool.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await reversedAppsPool[i].stop();
  }
}

export default stop;
