import semver from 'semver';

if (!semver.satisfies(process.version, global.packageJson.engines.node)) {
  // Strip version range characters leaving the raw semantic version for output
  const rawVersion = global.packageJson.engines.node.replace(/[^\d.]*/, '');
  const message = `This package requires at least Node v${rawVersion}. `
  + `You have ${process.version}.\n`
  + 'See https://github.com/everscale-actions/evernode-se '
  + 'for details.\n';
  throw Error(message);
}
