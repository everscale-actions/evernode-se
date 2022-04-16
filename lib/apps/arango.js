import { readdirSync } from 'fs';
import { join } from 'path';
import { execFile, spawnSync } from 'child_process';
import { Database } from 'arangojs';
import { retry } from '@lifeomic/attempt';
import config from './arango-config.js';
import getApp from '../app-base.js';
import appBaseStart from '../app-base-start.js';

function checkMigations() {
  process.stdout.write('  Checking arango migrations..\n');
  readdirSync(config.migrationsPath).forEach((file) => {
    process.stdout.write(`  - ${file}.. `);
    const params = config.paramsMigrations;
    params.push(`${join(config.migrationsPath, file)}`);
    spawnSync(config.binPathClient, params, {});
    process.stdout.write('Done\n');
  });
}

const app = getApp(config);

app.start = async () => {
  // start arango server
  await appBaseStart(config);

  // wait for arango db
  await retry(() => {
    const db = new Database({ url: `tcp://localhost:${global.arangoPort}` });
    return db.version();
  }, { delay: 500, maxAttempts: 60 });

  // apply migrations
  checkMigations();
};

app.version = async () => new Promise((resolve, reject) => {
  execFile(config.binPath, ['--version'], (error, stdout) => {
    if (error) {
      reject(error);
    }
    const version = stdout.split('\n').find((s) => s.startsWith('full-version-string:')).split(':')[1].trim();
    resolve({ app: config.serviceName, version });
  });
});

export default app;
