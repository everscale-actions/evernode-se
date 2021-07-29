const path = require('path');
const fs = require('fs');
const tar = require('tar');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');
const rimraf = require('rimraf');
const stop = require('./tonos-se-stop');
const downloader = require('./downloader');
const { version: binariesRelease } = require('../package.json');

const releasePrefix = 'tonos-se';

const platform = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' }[os.platform()];

const releaseHashFilePith = path.join(global.appsPath, 'release.sha256');

function getReleaseAssetDownloadUrls() {
  const binDownloadUrl = `https://github.com/${global.githubBinariesRepository}/releases/download/${binariesRelease}/${releasePrefix}-${platform}-${binariesRelease}.tar.gz`;
  const hashDownloadUrl = `${binDownloadUrl}.sha256`;
  return { binaries: binDownloadUrl, hash: hashDownloadUrl };
}

function getFileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

async function isRemoteHashChanged(releaseFilePath, hashDownloadUrl) {
  if (!fs.existsSync(releaseFilePath)) {
    return true;
  }
  const localHash = getFileHash(releaseFilePath);
  try {
    const result = await axios({ url: hashDownloadUrl });
    const remoteHash = result.data.trim();
    return (localHash !== remoteHash);
  } catch {
    process.stdout.write(`Remote hash ${hashDownloadUrl} is unavailable! Skip hash checking.. `);
    return false;
  }
}

async function install() {
  // get binaries release info from github and compose urls to download archive and hash files
  const downloadUrls = getReleaseAssetDownloadUrls();
  const cacheReleaseFolder = global.cachePath;
  const releaseFilePath = path.join(cacheReleaseFolder, path.basename(downloadUrls.binaries));

  // ensure that local binaries arhive hash is the same as remote hash
  process.stdout.write('* Verifying checksum.. ');
  const remoteHashChanged = await isRemoteHashChanged(releaseFilePath, downloadUrls.hash);
  process.stdout.write('Done\n');

  // download new binaries if hash changed
  if (remoteHashChanged) {
    await downloader.getBinaryFile(downloadUrls.binaries, cacheReleaseFolder);
  }

  // drop apps dir if hash changed
  const releaseHash = getFileHash(releaseFilePath);
  if (fs.existsSync(global.appsPath)
        && (!fs.existsSync(releaseHashFilePith)
        || fs.readFileSync(releaseHashFilePith).toString() !== releaseHash)) {
    process.stdout.write('* Binary package has been changed! Applying updates..\n');
    await stop();
    rimraf.sync(global.appsPath);
  }

  // unzip apps
  if (!fs.existsSync(global.appsPath)) {
    fs.mkdirSync(global.appsPath);
    process.stdout.write(`* Decompressing ${path.basename(releaseFilePath)}.. `);
    await tar.x({ file: releaseFilePath, C: global.appsPath });
    fs.writeFileSync(releaseHashFilePith, releaseHash);
    process.stdout.write('Done\n');
  }

  // return info about used binaries release and available tonos se versions in assets
  return { binariesRelease };
}

module.exports = install;
