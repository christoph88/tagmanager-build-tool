import { readFileSync } from "fs";
import { google } from "googleapis";
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
  console.log(workspaces);

  // iterate over workspaces and upload a new version of a tag
  for (const workspace of workspaces.workspace) {
    console.log(`Uploading ${workspace.workspaceId} - ${workspace.name}`);
    const workspacePath = `accounts/${workspace.accountId}/containers/${workspace.containerId}/workspaces/${workspace.workspaceId}`;

    // Load the tags from a JSON file
    const tags = JSON.parse(
      readFileSync(
        `workspaces/${workspace.workspaceId}-${workspace.name}/tags/tags.json`,
        "utf8"
      )
    );

    // Create or update each tag
    for (const tag of tags.tag) {
      // Construct the tag object to match the Google Tag Manager API request format
      const requestTag = {
        path: tag.path,
        accountId: tag.accountId,
        containerId: tag.containerId,
        workspaceId: tag.workspaceId,
        tagId: tag.tagId,
        name: tag.name,
        type: tag.type,
        parameter: tag.parameter
          ? tag.parameter.map((param) => {
              return {
                type: param.type,
                key: param.key,
                value: param.value,
              };
            })
          : [],
        firingTriggerId: tag.firingTriggerId
          ? tag.firingTriggerId.map(String)
          : [],
      };
      try {
        await tagmanager.accounts.containers.workspaces.tags.create({
          auth: authClient,
          parent: workspacePath,
          requestBody: requestTag,
        });
        console.log(`Tag ${tag.name} uploaded successfully.`);
      } catch (error) {
        console.error(`Failed to upload tag ${tag.name}:`, error);
      }
    }
  }
}
uploadTag();
