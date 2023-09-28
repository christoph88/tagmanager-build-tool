# TBT - Tagmanager build tool

## Description

Tagmanager build tool is a tool which downloads and uploads your Tagmanager tags, variables and templates.
This will enable you to work in a code editor of choice and version your code.

## Roadmap

Following ideas I am toying with but their is no strict timeline:

1. Enable transpiling of ES6 to ES5 which enables you to write tag, variables and templates in a modern vesion of javascript.
1. Test suite: enable automated testing of your code.

## Installation

1. Run `npm install -g tbt`
1. Create a Google Cloud Project and connect enable the Tagmanager API.
1. After enabling the API create a service account with access to use that API.
1. Download the key as json and save it in the root as `gcp-sa-key.json`.

1. Create a `.env` file. You can find the required id's in your tagmanager url
`<https://tagmanager.google.com/#/container/accounts/<accountid>/containers/<containerid>/workspaces/<workspaceid>`
1. Run `tbt pull` to see if everything works.

``` .env
ACCOUNT_ID=<your account id>
CONTAINER_ID=<your container id>
USER_EMAIL=<service account email address>
USER_NAME='<This name you want to display when you do uploads>'
```

## Options

Run `tbt` to see help or `tbt <command>` to see the help for each command.

```

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  pull [options]  Pull changes from Tagmanager
  push [options]  Push changes to tagmanager. Include a comma seperated list of paths to process or omit to process
                  all.
  help [command]  display help for command
```

## Workflow

### 1. Pull

Download all container data, `--enableProcessing` if you want to edit the javascript and html files in your code-editor.

### 3. Push

Upload all or specified (by id) tags, variables or templates.

> :warning: **Fingerprinting errors**: When running the update function and the fingerprints have changed e.g. somebody did a change in tagmanager the upload will fail. Download the container again, compare the changes and push again.
