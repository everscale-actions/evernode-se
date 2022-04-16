import { openSync, writeFileSync } from 'fs';
import { join } from 'path';
import { retry } from '@lifeomic/attempt';
import { spawn } from 'child_process';
import appStatus from './app-base-status.js';
import PortsAlreadyInUseError from './errors/ports-already-in-use.js';

function checkPortIsAvailable(status) {
  const portInUseByServiceName = status.portStatuses
    .filter((p) => p.inUse)
    .map((p) => ({ serviceName: status.serviceName, port: p.port }));

  if (portInUseByServiceName.length > 0) {
    throw new PortsAlreadyInUseError(portInUseByServiceName);
  }
}

async function waitForPortsAreUsed(config) {
  await retry(async () => {
    const status = await appStatus(config);
    const notOccupaiedPorts = status.portStatuses
      .filter((p) => !p.inUse)
      .map((p) => p.port);

    if (notOccupaiedPorts.length > 0) {
      // todo: create specified error
      throw new Error(`Service ${config.serviceName} doesn't occupy ports ${notOccupaiedPorts.join(',')} in time.`);
    }
  }, { delay: 500, maxAttempts: 60 });
}

async function start(config) {
  const status = await appStatus(config);

  if (status.isRunning) {
    process.stdout.write(`* Service ${config.serviceName} already started!\n`);
    return;
  }

  process.stdout.write(`* Starting ${config.serviceName}.. `);

  checkPortIsAvailable(status);

  // fill environment variables
  if (config.env) {
    Object.entries(config.env).forEach(([key, value]) => {
      process.env[key] = value;
    });
  }

  const logStream = config.logsPath ? openSync(join(config.logsPath, 'stdout.log'), 'w') : 'ignore';
  const errStream = config.logsPath ? openSync(join(config.logsPath, 'stderr.log'), 'w') : 'ignore';
  const proc = spawn(config.binPath, config.paramsStart, { cwd: config.dataPath, detached: true, stdio: ['ignore', logStream, errStream] });
  if (config.createPidFile && proc.pid) {
    writeFileSync(config.pidFilePath, proc.pid.toString());
  }
  proc.unref();

  await waitForPortsAreUsed(config);

  process.stdout.write('Done \n');
}

export default start;
