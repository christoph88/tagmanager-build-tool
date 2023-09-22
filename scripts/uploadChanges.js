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
      // Already start reading tag file
      const tagFile = readFileSync(
        `workspaces/${tag.tagId}-${tag.name.replace(/ /g, "_").html}`
      );

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

        const htmlParameterIndex = requestTag.parameter?.findIndex((p) => {
          return p.type === "template" && p.key === "html";
        });

        // TODO remove log
        console.log("tagFile", tagFile);

        requestTag.parameter[htmlParameterIndex].value = tagFile;

        try {
          // TODO remove log
          console.log("requestBody", requestTag);
          const response =
            await tagmanager.accounts.containers.workspaces.tags.update({
              auth: authClient,
              fingerprint: tag.fingerprint,
              path: tag.path,
              requestBody: requestTag,
            });
          console.log(`Tag ${tag.name} uploaded successfully.`);
          console.log(response.status);
        } catch (error) {
          console.error(`Failed to upload tag ${tag.name}.`);
          console.error(JSON.stringify(error.errors, null, 2));
          console.error(error.status);
        }
      }
    }
  }
}
uploadTag();
