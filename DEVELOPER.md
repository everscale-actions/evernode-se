# Evernode SE

The solution prepares special application packs (releases) for running Evernode OS Startup Edition without Docker for different Operational Systems. The main idea for the solution is creating standardized application packs.

## How it works

To make the process of building fast and easy, we use Github Actions and GitHub Workflow for building all necessary binary application packs in everscale-actions/evernode-se-binaries repository. Evernode SE application pack is a tar.gz archive that contains applications (Nginx, ArangoDB, Q Server, Evernode) and configuration files to quick start. The full list of application packs could be found here. 

### Building applications

Almost all GitHub Jobs in [build-and-release.yml](https://github.com/everscale-actions/evernode-se-binaries/blob/main/.github/workflows/build-and-release.yml) Workflow file use [build matrix](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix). This approach allows us to build each possible version of application pack for each Operating System, easy and clean delivery to the clients. Below is described general information about building each application in binary packs.

> Each night a special workflow file checks a new verion of [Evernode OS Startup Edition](https://github.com/tonlabs/evernode-se). If detects a new verision, [node-release-detection.yml](https://github.com/everscale-actions/evernode-se-binaries/blob/main/.github/workflows/node-release-detection.yml) initiation a process of building and publishing a new release of application pack.

| Matrix                                              | Ever Node | Nginx | Arango DB | Q Server |
| --------------------------------------------------- | --------- | ----- | --------- | -------- |
| OS: [ ubuntu-18.04, macos-10.15, windows-2019 ]     | x         | x     | x         | x        |
| Ever Node SE versions: [ 0.24.12, 0.24.13, 0.25.0 ] | x         | -     | -         | -        |

Version of applications can be changed by settings ENV variables in [build-and-release.yml](https://github.com/everscale-actions/evernode-se-binaries/blob/main/.github/workflows/build-and-release.yml). 

```yml
ARANGODB_VERSION: 3.7.9
NGINX_VERSION: 1.19.7
```

#### Build Ever Node

- Checkout evernode-se
- Cache cargo
- Build
- Pack result and publish artifact
- Tests
- Publish npm

#### Build Nginx

- Download necessary version using [NPM Package](https://github.com/everscale-actions/evernode-se-binaries/tree/main/nginx)
- Pack result and publish artifact

#### Build Arango DB

- Download necessary version using [config.arango.js](https://github.com/everscale-actions/evernode-se-binaries/blob/main/config.arangodb.js)
- Unpack archive and create right structure
- Pack result and publish artifact

#### Build Q-Server

- Checkout [tonlabs/ton-q-server](https://github.com/tonlabs/ton-q-server)
- NPM install
- Pack result and publish artifact

#### Build Config Files

- Checkout [tonlabs/evernode-se](https://github.com/tonlabs/evernode-se)
- Copy necessary files from evernode-se repo
- Pack result and publish artifact

#### Publish Release

- Download all workflow run artifacts
- Merge tar files
- Upload Release Artifact


## Push new version
```sh
tag=`jq -r .version package.json`; git add .; git commit -m $tag; git push; git tag $tag -f; git push -f origin $tag
```