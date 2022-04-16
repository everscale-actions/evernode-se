import axios from 'axios';
import { mkdirSync, createWriteStream } from 'fs';
import { basename, join } from 'path';
import Progress from 'progress';

async function getBinaryFile(fileUrl, dstFolder) {
  const dstFileName = basename(fileUrl);
  mkdirSync(dstFolder, { recursive: true });

  const pathToFile = join(dstFolder, dstFileName);
  const { data, headers } = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
  });

  const contentLength = headers['content-length'];

  const progressBar = new Progress(`* Downloading ${dstFileName} [:bar] :percent :etas left`, {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(contentLength, 10),
  });

  data.on('data', (chunk) => progressBar.tick(chunk.length));

  const writer = createWriteStream(pathToFile);
  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export default { getBinaryFile };
