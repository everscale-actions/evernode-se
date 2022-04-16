import { readFile } from 'fs';
import { join } from 'path';
import config from './q-server-config.js';
import getApp from '../app-base.js';

const app = getApp(config);

app.version = async () => new Promise((resolve, reject) => {
  readFile(join(config.appPath, 'package.json'), (err, data) => {
    if (err) {
      reject(err);
    }
    resolve({
      app: config.serviceName,
      version: JSON.parse(data.toString()).version,
    });
  });
});

export default app;
