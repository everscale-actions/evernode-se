#!/usr/bin/env node
import boxen from 'boxen';
import commandLineArgs from 'command-line-args';
import getUsage from 'command-line-usage';
import PortsAlreadyInUseError from '../lib/errors/ports-already-in-use.js';
import evernode from '../lib/evernode-se.js';

const appName = Object.keys(global.packageJson.bin)[0];

/* first - parse the main command */
const mainDefinitions = [
  { name: 'command', defaultOption: true },
];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const argv = mainOptions._unknown || [];

function cj(json) {
  return JSON.stringify(json, null, 2);
}

async function main() {
  switch (mainOptions.command) {
    case 'help': {
      const sections = [
        {
          header: 'Evernode SE CLI',
          content: 'Easy install, configure and manage Evernode Startup Edition without Docker.',
        },
        {
          header: 'Synopsis',
          content: `$ ${appName} <command> <options>`,
        },
        {
          header: 'Command List',
          content: [
            { name: 'start | stop | restart', summary: 'Start, stop or restart necessary services.' },
            { name: 'config', summary: 'Show and configure listening ports and other options. Follow \'config options\' in this help section to get details.' },
            { name: 'reset', summary: 'Reset config parameters and remove internal applications without data files' },
            { name: 'remove', summary: 'Removing whole applications and data files.' },
            { name: 'status', summary: 'Display status.' },
            { name: 'version', summary: 'Display version of applications.' },
          ],
        },
        {
          header: 'config <options>',
          content: [
            { name: '--q-server-port', summary: 'Set listening port for Q-Server' },
            { name: '--nginx-port', summary: 'Set listening port for Nginx' },
            { name: '--ton-node-port', summary: 'Set listening port for Ton Node' },
            { name: '--ton-node-kafka-msg-port', summary: 'Set listening port for Ton Node Kafka' },
            { name: '--arango-port', summary: 'Set listening port for ArangoDB' },
            { name: '--github-binaries-repository', summary: 'GitHub repository with binaries. Default: {underline everscale-actions/evernode-se}' },
          ],
        },
        {
          content: 'Project home: {underline https://github.com/everscale-actions/evernode-se}',
        },
      ];

      process.stdout.write(`${getUsage(sections)}\n`);
      break;
    }
    case 'start':
    case 'restart': {
      if (mainOptions.command === 'restart') {
        await evernode.stop();
      }
      try {
        await evernode.start();
      } catch (ex) {
        if (ex instanceof PortsAlreadyInUseError) {
          ex.statuses
            .forEach((ps) => process.stderr.write(`Service ${ps.serviceName} port ${ps.port} is already in use\n`));
          process.stderr.write(`Please change service port using command 'config <paramters>'. To get more details use '${appName} help'\n`);
          return;
        }
        throw ex;
      }

      process.stdout.write(boxen(
        `Evernode Live Explorer: http://localhost:${global.nginxPort}\n`
        + `GraphQL: http://localhost:${global.nginxPort}/graphql\n`
        + `ArangoDB: http://localhost:${global.arangoPort}\nApplication folder: ${global.appRoot}`,
        { padding: 1, margin: 1, borderStyle: 'double' },
      ));
      break;
    }
    case 'stop':
      await evernode.stop();
      break;
    case 'reset': {
      await evernode.reset(false);
      break;
    }
    case 'remove': {
      await evernode.reset(true);
      break;
    }
    case 'status': {
      const statuses = await evernode.status();
      statuses.forEach((s) => {
        const statusText = s.isRunning ? `running. [PID:${s.pid} PORTS:${s.portStatuses.map((p) => p.port)}]` : 'stopped';
        process.stdout.write(`Service ${s.serviceName} is ${statusText}\n`);
      });

      break;
    }
    case 'config': {
      const configDefenitions = [
        { name: 'nginx-port', type: Number },
        { name: 'arango-port', type: Number },
        { name: 'ton-node-port', type: Number },
        { name: 'q-server-port', type: Number },
        { name: 'ton-node-kafka-msg-port', type: Number },
        { name: 'github-binaries-repository', type: String },
      ];

      // show current config
      const config = commandLineArgs(configDefenitions, { argv });
      if (Object.keys(config).length === 0) {
        process.stdout.write(`${cj(evernode.config.get())}\n`);
      } else {
        evernode.config.set(config);
      }
      break;
    }
    case 'version': {
      const version = await evernode.version();
      process.stdout.write(`${cj(version)}\n`);
      break;
    }
    default:
      process.stdout.write(`Unknown command. Use command '${appName} help' to list available commands\n`);
      break;
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  }
})();
