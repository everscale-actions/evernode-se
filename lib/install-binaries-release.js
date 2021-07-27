const path = require('path');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const { version: cliVersion } = require('../package.json');

const releaseCacheFile = path.join(global.cachePath, 'release.json');

async function getReleaseFromGitHub() {
  const repoOwnerAndName = global.githubBinariesRepository.split('/');
  const octokit = new Octokit();
  const { data: release } = await octokit.rest.repos.getReleaseByTag({
    owner: repoOwnerAndName[0],
    repo: repoOwnerAndName[1],
    tag: cliVersion,
  });
  return release;
}

function setReleaseToCache(release) {
  fs.writeFileSync(releaseCacheFile, JSON.stringify(release, null, 2));
}

function getReleaseFromCache() {
  if (!fs.existsSync(releaseCacheFile)) {
    throw Error('Local cache is not found. Connect your machine to the Internet to fix this problem!');
  }

  return JSON.parse(fs.readFileSync(releaseCacheFile).toString());
}

async function get() {
  try {
    const binariesAssets = await getReleaseFromGitHub();
    setReleaseToCache(binariesAssets);
    return binariesAssets;
  } catch (e) {
    // get caches assets because github api has a rate limit and may end unexpectable
    process.stdout.write(`Warn! GitHub API is unavalable(${e.message}).\n`);
    return getReleaseFromCache();
  }
}

module.exports = get;
