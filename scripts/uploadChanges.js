import { google } from "googleapis";
import { readFileSync } from "fs";

const tagmanager = google.tagmanager("v2");

async function uploadTag() {
  const credentials = JSON.parse(readFileSync("./gcp-sa-key.json"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/tagmanager.edit.containers"],
  });

  const authClient = await auth.getClient();

  // get all active workspaces
  const workspaces = JSON.parse(readFileSync("workspaces/workspaces.json"));

  // iterate over workspaces and upload a new version of a tag
  for (const workspace of workspaces.workspace) {
    const workspacePath = `accounts/${workspace.accountId}/containers/${workspace.containerId}/workspaces/${workspace.workspaceId}`;

    // Load the tag from a JSON file
    const tag = JSON.parse(
      readFileSync(
        `workspaces/${workspace.workspaceId}-${workspace.name}/tags/tags.json`,
        "utf8"
      )
    );

    // Create or update the tag
    await tagmanager.accounts.containers.workspaces.tags.create({
      auth: authClient,
      parent: workspacePath,
      requestBody: tag,
    });
  }
}

uploadTag().catch(console.error);
