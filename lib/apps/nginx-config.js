import { join } from 'path';
import { platform } from 'os';
import getAppConfig from '../app-config-base.js';

const serviceName = 'nginx';

const config = getAppConfig(serviceName);
config.binPath = join(config.appPath, 'nginx') + (platform() === 'win32' ? '.exe' : '');
config.paramsStart = ['-c', `${join(config.dataPath, 'nginx.conf')}`];
config.paramsStop = ['-c', `${join(config.dataPath, 'nginx.conf')}`, '-s', 'stop'];
config.ports = [global.nginxPort];

export default config;
