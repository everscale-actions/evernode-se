import { join } from 'path';
import { platform } from 'os';
import getAppConfig from '../app-config-base.js';

const serviceName = 'ton-node';
const config = getAppConfig(serviceName);
config.binPath = join(config.appPath, (platform() === 'win32' ? 'evernode_se.exe' : 'evernode_se'));
config.createPidFile = true;
config.paramsStart = ['--blockchain-config', 'blockchain.conf.json', '--config', 'ton-node.conf.json', '--workdir', config.dataPath];

config.ports = [global.nodeSeRequestsPort];

export default config;
