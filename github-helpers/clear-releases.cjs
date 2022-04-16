const octokit = require('@octokit/request');
const ProgressBar = require('progress');

const token = process.env.TOKEN;
if (!token) throw Error('no TOKEN provided');

const owner = 'everscale-actions';
const repo = 'evernode-se';

async function main() {
  const headers = { authorization: `token ${token}` };

  const result = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    headers, owner, repo,
  });

  const releases = result.data;

  // console.log(releases);
  // return;

  const bar = new ProgressBar(':percent eta[:eta] [:bar] :release', { total: releases.length, width: 20 });
  // eslint-disable-next-line no-restricted-syntax
  for (const release of releases) {
    // eslint-disable-next-line no-await-in-loop
    await octokit.request('DELETE /repos/{owner}/{repo}/releases/{release_id}', {
      headers, owner, repo, release_id: release.id,
    });
    // console.log(`DELETE  ${release.url}`);
    bar.tick({ release: release.tag_name });
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
