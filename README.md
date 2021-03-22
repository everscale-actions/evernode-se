# ton-node-se-binaries

The solution prepares special application packs (releases) for running [TON OS Startup Edition without Docker](https://github.com/ton-actions/tonos-se) for different Operational Systems. The main idea for the solution is creating standardized application packs.

## How it works

### Prepare application pack

To make the process of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operating systems: Linux, MacOS and Windows. A group of three application packs is called release. An application pack is a tar.gz archive that contains different application and configuration files for them like:

- nginx
- arangodb
- q-server
- ton node

<img width="1171" alt="Screenshot 2021-03-17 at 15 13 51" src="https://user-images.githubusercontent.com/54890287/111465671-715e0100-8733-11eb-8e9b-029bde427b93.png">

> Note: release has the same version of ton node's version available releases published.

### How to build custom application pack

It is possible to use custom versions or default config files of any application inside the application pack. Just fork [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries), enable GitHub actions and apply changes you want.
