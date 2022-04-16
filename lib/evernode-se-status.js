import appPool from './apps/apps-pool.js';

async function status() {
  return Promise.all(appPool.map((app) => app.status()));
}

export default status;
