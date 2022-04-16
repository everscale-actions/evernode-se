import {
  readFileSync, writeFileSync, existsSync, openSync,
} from 'fs';
import { join } from 'path';
import { execFileSync, execFile } from 'child_process';
import ConfigParser from '@webantic/nginx-config-parser';
import { retry } from '@lifeomic/attempt';
import config from './nginx-config.js';
import getApp from '../app-base.js';
import appBaseStart from '../app-base-start.js';

function transformConfig() {
  const appCfgPath = join(config.appPath, 'nginx.conf');
  const dataCfgPath = join(config.dataPath, 'nginx.conf');

  const parser = new ConfigParser();
  const cfg = parser.toJSON(readFileSync(appCfgPath, 'utf8'));

  cfg.user = 'nobody nogroup';

  cfg.pid = `"${config.pidFilePath.split('\\').join('/')}"`;

  cfg.http['upstream q-server'].server = `127.0.0.1:${global.qServerPort}`;
  cfg.http['upstream ton-node'].server = `127.0.0.1:${global.nodeSeRequestsPort}`;
  cfg.http.server.listen = `${global.nginxPort} reuseport`;

  cfg.http.error_log = `"${join(config.logsPath, 'error.log').split('\\').join('/')}"`;
  cfg.http.access_log = `"${join(config.logsPath, 'access.log').split('\\').join('/')}"`;

  cfg.http.server.include = `"${join(config.appPath, 'mime.types').split('\\').join('/')}"`;
  cfg.http.server.root = `"${join(global.appsPath, 'ton-live', 'web').split('\\').join('/')}"`;

  writeFileSync(dataCfgPath, parser.toConf(cfg));
}

function getIsPidFileExistsAction(pidFilePath) {
  return async () => new Promise((resolve, reject) => {
    if (existsSync(pidFilePath)) {
      reject(new Error('Process still exists'));
    }
    resolve();
  });
}

const app = getApp(config);

app.stop = async () => {
  const status = await app.status();
  if (!status.isRunning) {
    return;
  }
  process.stdout.write(`* Stopping ${config.serviceName}.. `);
  const logStream = config.logFile ? openSync(config.logFile, 'a') : 'ignore';
  const errStream = config.errFile ? openSync(config.errFile, 'a') : 'ignore';

  execFileSync(config.binPath, config.paramsStop, { cwd: config.dataPath, stdio: ['ignore', logStream, errStream] });

  await retry(getIsPidFileExistsAction(config.pidFilePath), { delay: 500, maxAttempts: 20 });
  process.stdout.write('Done\n');
};

app.start = async () => {
  transformConfig();
  await appBaseStart(config);
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['-v'], (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    const version = stderr.split(':')[1].trim();
    resolve({ app: config.serviceName, version });
  });
});

export default app;
