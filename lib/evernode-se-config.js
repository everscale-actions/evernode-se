import {
  existsSync, writeFileSync, readFileSync, rm,
} from 'fs';
import override from 'json-override';
import configDefault from './evernode-se-config-default.js';

function get() {
  if (!existsSync(global.configFile)) {
    writeFileSync(global.configFile, JSON.stringify(configDefault, null, 2));
  }

  const config = JSON.parse(readFileSync(global.configFile));
  return override(configDefault, config, true);
}

function set(config) {
  const result = override(get(), config, true);
  writeFileSync(global.configFile, JSON.stringify(result, null, 2));
  process.stdout.write('Saving parameters is successful. Use command \'restart\' for applying changes\n');
}

async function reset() {
  return new Promise((resolve) => { rm(global.configFile, resolve); });
}

export { get, set, reset };
