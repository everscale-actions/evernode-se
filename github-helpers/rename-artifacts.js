import octokit from '@octokit/request';
import ProgressBar from 'progress';

const token = process.env.TOKEN;
if (!token) throw Error('no TOKEN provided');

const owner = 'everscale-actions';
const repo = 'build-evernode-se';

async function main() {
  const headers = { authorization: `token ${token}` };
  const result = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    headers, owner, repo,
  });

  const releases = result.data;
  const assets = releases
    .map((r) => r.assets)
    .reduce((a1, a2) => a1.concat(a2), [])
    .filter((a) => a.name.startsWith('tonos-node-'));

  const bar = new ProgressBar(':percent eta[:eta] [:bar] :asset', { total: assets.length, width: 20 });
  // eslint-disable-next-line no-restricted-syntax
  for (const asset of assets) {
    const name = asset.name.replace('build-evernode-se', 'evernode-se-');
    // eslint-disable-next-line no-await-in-loop
    await octokit.request(`PATCH ${asset.url}`, { headers, name });
    bar.tick({
      asset: asset.name,
    });
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
