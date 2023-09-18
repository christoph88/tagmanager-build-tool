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
      // Filter out HTML tags only
      const htmlTag = tag.type === "html";

      if (htmlTag) {
        // Construct the tag object to match the Google Tag Manager API request format
        const requestTag = {
          path: tag.path,
          accountId: tag.accountId,
          containerId: tag.containerId,
          workspaceId: tag.workspaceId,
          tagId: tag.tagId,
          name: tag.name,
          parameter: tag.parameter,
          consentSettings: tag.consentSettings,
          monitoringMetadata: tag.monitoringMetadata,
          priority: tag.priority,
          type: tag.type,
        };
        try {
          await tagmanager.accounts.containers.workspaces.tags.update({
            auth: authClient,
            path: tag.path,
            fingerprint: tag.fingerprint,
            requestBody: requestTag,
          });
          console.log(`Tag ${tag.name} uploaded successfully.`);
        } catch (error) {
          console.error(
            `Failed to upload tag ${tag.name}:`,
            JSON.stringify(error.data, null, 2),
            JSON.stringify(error, null, 2)
          );
        }
      }
    }
  }
}
uploadTag();
