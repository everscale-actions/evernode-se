const path = require('path');
const os = require('os');
const { NginxBinary: nginxBinary } = require('nginx-binaries');

const nginxBin = os.platform() === 'win32' ? path.join('nginx', 'nginx.exe') : path.join('nginx', 'nginx');

(async () => {
  await nginxBinary.download({ version: process.env.NGINX_VERSION }, nginxBin);
})();
