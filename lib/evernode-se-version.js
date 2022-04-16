import appsPool from './apps/apps-pool.js';
import install from './install.js';

async function version() {
  await install();
  const appVersions = await Promise.all(appsPool.map((app) => app.version()));

  const apps = {};
  appVersions.forEach((app) => { apps[app.app] = app.version; });

  return {
    'package-version': global.packageJson.version,
    'evernode-se-release': global.packageJson.version.split('-')[0],
    apps,
  };
}

export default version;
