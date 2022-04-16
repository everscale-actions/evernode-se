import { join } from 'path';
import { platform } from 'os';
import getAppConfig from '../app-config-base.js';

const serviceName = 'arango';

const config = getAppConfig(serviceName);
const arangoEndpoing = `tcp://127.0.0.1:${global.arangoPort}`;

config.binPath = (platform() === 'win32' ? join(config.appPath, 'usr', 'bin', 'arangod.exe') : join(config.appPath, 'usr', 'sbin', 'arangod'));
config.binPathClient = (platform() === 'win32' ? join(config.appPath, 'usr', 'bin', 'arangosh.exe') : join(config.appPath, 'usr', 'bin', 'arangosh'));
config.migrationsPath = join(config.appPath, 'initdb.d');

config.createPidFile = true;
config.paramsStart = [
  '--config', join(config.appPath, 'config'),
  '--server.endpoint', arangoEndpoing,
  '--server.authentication', 'false',
  '--log.foreground-tty', 'true',
  '--javascript.startup-directory', join(config.appPath, 'usr', 'share', 'arangodb3', 'js'),
  '--javascript.app-path', join(config.appPath, 'var', 'lib', 'arangodb3-apps'),
  '--database.directory', join(config.dataPath, 'db'),
];
config.paramsMigrations = [
  '-c', 'none',
  '--server.authentication', 'false',
  '--javascript.startup-directory', join(config.appPath, 'usr', 'share', 'arangodb3', 'js'),
  `--server.endpoint=${arangoEndpoing}`,
  '--javascript.execute',
];
config.ports = [global.arangoPort];

export default config;
