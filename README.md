# google-tagmanager-gh-deploy

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Setup

1. set env variables
2. enable tagmanager api in google cloud
3. create service account for this api
4. go into tagmanager and give service account admin access by adding its email
5. give github actions read and write access

## Sync

1. get default workspace in master > daily run or manual trigger
2. run gh actions with workspace id and create pull request
3. on merge with master upload changes to tagmanager

## Edit

### On pull request creation

1. Get json files from tags, triggers, variables and custom templates

- save those files to a workspace number subfolder, or they will keep overwriting the default workspace.

2. Filter out only html entities
3. export the values to seperate js files

### On merge with master

4. on merge with master import the values from the js files back to the main json
5. upload main json so tagmanager is updated
