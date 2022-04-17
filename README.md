# Evernode SE

## How to use

### With installation:

```sh
npm i -g @everscale-actions/evernode-se
evernode-se help
```

### Without installation:

```sh
npx @everscale-actions/evernode-se help
```

### Select special version of Evernode SE
Use tag for select needed vesion. You can use latest or '_major[.minor[.patch]]' tag format.
Examples:
```
npx @everscale-actions/evernode-se@latest [command]
npx @everscale-actions/evernode-se@_0 [command]
npx @everscale-actions/evernode-se@_0.30 [command]
npx @everscale-actions/evernode-se@_0.30.1 [command]
npx @everscale-actions/evernode-se@_0.28 [command]
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