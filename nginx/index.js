import { join } from 'path';
import { platform } from 'os';
import { NginxBinary as nginxBinary } from 'nginx-binaries';

const nginxBin = platform() === 'win32' ? join('nginx', 'nginx.exe') : join('nginx', 'nginx');

(async () => {
  await nginxBinary.download({ version: process.env.NGINX_VERSION }, nginxBin);
})();
