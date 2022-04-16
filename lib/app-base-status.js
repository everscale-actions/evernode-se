import { existsSync, readFileSync, rmSync } from 'fs';
import isRunningCheck from 'is-running';
import { check } from 'tcp-port-used';

async function status(config) {
  const pidFile = config.pidFilePath;
  let pid = existsSync(pidFile) ? readFileSync(pidFile).toString().trim() : undefined;
  const isRunning = pid ? isRunningCheck(pid) : false;
  if (pid && !isRunning) {
    rmSync(config.pidFilePath);
    pid = undefined;
  }

  const portStatuses = await Promise.all(
    config.ports.map(async (port) => ({ port, inUse: await check(port) })),
  );

  return {
    serviceName: config.serviceName,
    pid,
    isRunning,
    portStatuses,
  };
}

export default status;
