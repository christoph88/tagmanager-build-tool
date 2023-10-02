# TBT - Tagmanager build tool

## TODO Remove these TODO's

## TODO

- pull src
- pull and extract
- build dist
  - build and transpile
  - build and test
- build and push dist
- push dist
- push src

## Description

Tagmanager build tool is a unofficial tool which downloads and uploads your Tagmanager tags, variables and templates.
This will enable you to work in a code editor of choice and version your code.

## Roadmap

Following ideas I am toying with but their is no strict timeline:

1. Enable transpiling of ES6 to ES5 which enables you to write tag, variables and templates in a modern vesion of javascript.
1. Test suite: enable automated testing of your code.

## Installation

1. Run `npm install -g tagmanager-build-tool`
1. Create a Google Cloud Project and connect enable the Tagmanager API.
1. After enabling the API create a service account with access to use that API.
1. Create a new folder where you want to work and optionally run `git init`.
1. Download the key as json and save it in the root as `gcp-sa-key.json`.

1. Create a `.env` file. You can find the required id's in your tagmanager url
`<https://tagmanager.google.com/#/container/accounts/<accountid>/containers/<containerid>/workspaces/<workspaceid>`

``` .env
ACCOUNT_ID=<your account id>
CONTAINER_ID=<your container id>
USER_EMAIL=<service account email address>
USER_NAME='<This name you want to display when you do uploads>'
```

7. Run `tbt pull` to see if everything works.

## Options

Run `tbt` to see help or `tbt <command>` to see the help for each command.

```
Usage: index [options] [command]

Tagmanager build tool

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  fetch           Fetch changes from Tagmanager without extracting code.
  pull            Pull changes from Tagmanager and extract code.
  build           Build json files so they are ready for upload.
  push [options]  Push changes to tagmanager. Include a comma seperated list of paths to process or omit to process all.
  help [command]  display help for command
```

## Workflow

### Fetch

Download all container data in JSON format. This is a direct download and is mostly usefull for obtaining the latest fingerprint.

### Pull

Download all container data in JSON format and extract custom code in seperate files. Allowing you to easily modify or version code in your own code editor.

### Build

Build requests in json files which can be used for upload. Will contain all of your modified code.

### Push

Upload all or specified (by build filename) tags, variables or templates.

> :warning: **Fingerprinting errors**: When running the update function and the fingerprints have changed (e.g. somebody did a change in tagmanager) the upload will fail. Run fetch to get the latest fingerprints. Build to get the new request objects and push to try again.
