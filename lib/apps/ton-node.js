import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';
import { parse, stringify } from 'yaml';
import { execFile } from 'child_process';
import config from './ton-node-config.js';
import getApp from '../app-base.js';
import appBaseStart from '../app-base-start.js';

function transformMainConfig() {
  const appCfgPath = join(config.appPath, 'ton-node.conf.json');
  const dataCfgPath = join(config.dataPath, 'ton-node.conf.json');
  const cfg = JSON.parse(readFileSync(appCfgPath, 'utf8'));

  cfg.port = global.nodeSePort;
  cfg.private_key = join(config.appPath, 'private-key');
  cfg.keys = [join(config.appPath, 'pub-key')];
  cfg.document_db.server = `127.0.0.1:${global.arangoPort}`;
  cfg.kafka_msg_recv.port = global.nodeSeRequestsPort;

  writeFileSync(dataCfgPath, JSON.stringify(cfg, null, 2));

  // copy blockchain.conf.json
  copyFileSync(join(config.appPath, 'blockchain.conf.json'), join(config.dataPath, 'blockchain.conf.json'));
}

function transformLogConfig() {
  const appCfgPath = join(config.appPath, 'log_cfg.yml');
  const dataCfgPath = join(config.dataPath, 'log_cfg.yml');
  const cfg = parse(readFileSync(appCfgPath, 'utf8'));

  cfg.appenders.logfile.path = join(config.logsPath, 'output.log');

  writeFileSync(dataCfgPath, stringify(cfg, null, 2));
}

const app = getApp(config);

app.start = async () => {
  transformMainConfig();
  transformLogConfig();

  await appBaseStart(config);
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['--version'], (error, stdout) => {
    if (error) {
      reject(error);
    }
    const version = stdout.split('\n')[0].trim();
    resolve({ app: config.serviceName, version });
  });
});

export default app;
