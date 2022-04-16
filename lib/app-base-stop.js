import { readFileSync } from 'fs';
import { retry } from '@lifeomic/attempt';
import appStatus from './app-base-status.js';

function checkAppStopped(config) {
  return async () => {
    const status = await appStatus(config);
    if (status.isRunning) {
      throw new Error('Process still exists');
    }
  };
}

async function stop(config) {
  const status = await appStatus(config);
  if (!status.isRunning) {
    return;
  }

  process.stdout.write(`* Stopping service ${config.serviceName}.. `);
  const pid = readFileSync(config.pidFilePath).toString().trim();
  try {
    process.kill(pid);
    await retry(checkAppStopped(config), { delay: 500, maxAttempts: 30 });
  } catch (error) {
    process.stderr.write(`Stop process ${pid} failed with error: ${error} `);
  }
  process.stdout.write('Done\n');
}

export default stop;
