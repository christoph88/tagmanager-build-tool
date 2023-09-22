# google-tagmanager-gh-deploy

## Workflow

### 1. Create pull request

On create of the pull request the tagmanager container will be downloaded and diff'ed with main. You'll also get the fingerprints.

New javascript/html files are transpiled into ES6.

### 2. Change code

Change code, you can manually run upload if you want to test. If somebody does changes directly into tagmanager the fingerprint will change and you will need to run the download action again without processing.

### 3. Merge PR to main

When merging to main the updates are uploaded to tagmanager.

## Setup

1. set env variables
2. enable tagmanager api in google cloud
3. create service account for this api
4. go into tagmanager and give service account admin access by adding its email
5. give github actions read and write access

## Fingerprinting and sync errors

When running the update function and the fingerprints have changed e.g. somebody did a change in tagmanager the upload will fail. Download the container again in master and rebase.

## Github Actions

This tool runs entirely using Github Actions in Github Workflows. Get familiar with them.
