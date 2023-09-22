import fs from "fs";
import { google } from "googleapis";
const tagmanager = google.tagmanager("v2");

async function uploadTag() {
  const credentials = JSON.parse(
    await fs.promises.readFile("./gcp-sa-key.json", "utf8")
  );
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/tagmanager.edit.containers"],
  });

  const authClient = await auth.getClient();

  // get all active workspaces
  const workspaces = JSON.parse(
    await fs.promises.readFile("workspaces/workspaces.json", "utf8")
  );

  // iterate over workspaces and upload a new version of a tag
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading ${workspaceDir}`);

    // Load the tags from a JSON file
    const tags = JSON.parse(
      await fs.promises.readFile(`${workspaceDir}/tags/tags.json`, "utf8")
    );

    // Create or update each tag
    for (const tag of tags.tag) {
      const tagsDir = workspaceDir + "/tags";
      // Filter out HTML tags only
      const htmlTag = tag.type === "html";

      if (htmlTag) {
        console.log(`Process Tag ${tag.name}.`);
        // Already start reading tag file
        const tagFile = await fs.promises.readFile(
          `${tagsDir}/${tag.name.replace(/ /g, "_")}.html`,
          "utf8"
        );

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

        requestTag.parameter[htmlParameterIndex].value = tagFile;

        try {
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

const uploadChanges = async () => {
  await uploadTag();
};

uploadChanges();
