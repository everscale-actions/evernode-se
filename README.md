[<img src="https://avatars3.githubusercontent.com/u/67861283?s=150&u=4536b61595a1b422604fab8a7012092d891278f6&v=4" align="right" width="150">](https://freeton.org/)

# Evernode SE without docker

## How to use

### With installation:

```sh
npm i -g @everscale-actions/evernode-se
evernode-se help
```

### Without installation:

```sh
npx -y @everscale-actions/evernode-se@latest help
```

### Select special version of Evernode SE
Use tag for select needed vesion. You can use latest or '_major[.minor[.patch]]' tag format.

Availible tags can be found at https://www.npmjs.com/package/@everscale-actions/evernode-se?activeTab=versions

Examples:
```
npx -y @everscale-actions/evernode-se@_0 [command]
npx -y @everscale-actions/evernode-se@_0.30 [command]
npx -y @everscale-actions/evernode-se@_0.30.1 [command]
npx -y @everscale-actions/evernode-se@_0.28 [command]
```

## Command List
```
start | stop | restart   Start, stop or restart necessary services.                                                                         
config                   Show and configure listening ports and other options. Follow 'config options' in this help section to get details. 
reset                    Reset config parameters and remove internal applications without data files                                        
remove                   Removing whole applications and data files.                                                                        
status                   Display status.                                                                                       
version                  Display version of applications.        
```
