name: Download Workspace

on:
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:
    inputs:
      workspace_id:
        description: 'Workspace ID'
        required: true

jobs:
  download-container:
    runs_on: ubuntu-latest
    env:
      ACCOUNT_ID: ${{ secrets.ACCOUNT_ID }}
      CONTAINER_ID: ${{ secrets.CONTAINER_ID }}
      WORKSPACE_ID: ${{ github.event.inputs.workspace_id }}
      USER_EMAIL: ${{ secrets.USER_EMAIL }}
      USER_NAME: ${{ secrets.USER_NAME }}
      GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js environment
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install jq
        run: sudo apt-get install jq

      - name: Install dependencies
        run: npm ci

      - name: Set up Google Cloud credentials
        run: echo "$GCP_SA_KEY" > ./gcp-sa-key.json

      - name: Download container
        run: node ./scripts/downloadContainer.js

      - name: Commit and push changes
        run: |
          git config --local user.email "${{ env.USER_EMAIL }}"
          git config --local user.name "${{ env.USER_NAME }}"
          git add tags/tags.json triggers/triggers.json variables/variables.json templates/templates.json workspaces/workspaces.json
          WORKSPACE_NAME=$(jq -r '.[].name' workspaces/workspaces.json)
          git commit -m "Update container data for $WORKSPACE_NAME" -a
          git push