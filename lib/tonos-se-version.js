const appsPool = require('./apps/apps-pool');
const install = require('./install');
const { version: packageVersion } = require('../package.json');

async function version() {
  await install();
  const appVersions = await Promise.all(appsPool.map((app) => app.version()));

  const apps = {};
  appVersions.forEach((app) => { apps[app.app] = app.version; });

  return {
    'package-version': packageVersion,
    'tonos-se-release': packageVersion.split('-')[0],
    apps,
  };
}

module.exports = version;
