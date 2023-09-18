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

## Github Actions

### Download and process container

Download tagmanager container and process all html, template and js files so they can be edited.
These files will be merged into the request object when trying to upload.

### Download container

If an error occurs when trying to upload, the fingerprint has most likely changed.
Download container without processing (and overwriting) the editable html, templates and js files.

### Upload changes

When you have done the required edits use this script to upload the information back to the Tagmanager container.

## Sync

1. get default workspace in master > daily run or manual trigger, downloads all workspaces
3. on merge with master upload changes to tagmanager depending on which workspace files has been adapted

## Edit

### On manual run or cronjob

1. Get json files from tags, triggers, variables and custom templates

- save those files to a workspace number subfolder, or they will keep overwriting the default workspace.

2. Filter out only html entities
3. export the values to seperate js files

### On PR merge with master or manually

4. on merge with master import the values from the js files back to the main json
5. upload main json so tagmanager is updated, do this based on which workspace files are adapted

notes

- when running the update function and the fingerprints have changed e.g. somebody did a change in tagmanager the upload will fail. Download the container again in master and rebase.
