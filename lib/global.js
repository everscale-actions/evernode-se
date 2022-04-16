import { join as joinPath, resolve as resolvePath } from 'path';
import resolve from 'resolve-dir';
import fs from 'fs';
import { get as getConfig } from './evernode-se-config.js';

global.appRoot = resolve('~/.evernode-se');
global.configFile = joinPath(global.appRoot, 'config.json');
global.cachePath = joinPath(global.appRoot, '.cache');
global.appsPath = joinPath(global.appRoot, 'apps');
global.dataPath = joinPath(global.appRoot, 'data');
global.logsPath = joinPath(global.appRoot, 'logs');
global.procPath = joinPath(global.appRoot, 'proc');

fs.mkdirSync(global.appRoot, { recursive: true });
fs.mkdirSync(global.cachePath, { recursive: true });

const packagesJson = fs.readFileSync(resolvePath('__dirname/../package.json')).toString();
global.packageJson = JSON.parse(packagesJson);

const config = getConfig();
global.nginxPort = parseInt(process.env.TONOS_SE_NGINX_PORT, 10) || config['nginx-port'];
global.qServerPort = parseInt(process.env.TONOS_SE_Q_PORT, 10) || config['q-server-port'];
global.nodeSePort = parseInt(process.env.TONOS_SE_NODESE_PORT, 10) || config['ton-node-port'];
global.nodeSeRequestsPort = parseInt(process.env.TONOS_SE_NODESE_KAFKA_MSG_PORT, 10) || config['ton-node-kafka-msg-port'];
global.arangoPort = parseInt(process.env.TONOS_SE_ARANGO_PORT, 10) || config['arango-port'];
global.githubBinariesRepository = process.env.GITHUB_BINARIES_REPOSITORY || config['github-binaries-repository'];
