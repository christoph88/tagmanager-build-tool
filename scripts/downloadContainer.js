import { google } from "googleapis";
import {
  readFileSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  statSync,
  renameSync,
} from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";
import {
  processTags,
  processVariables,
  processTemplates,
} from "./processEntities.js";

const tagmanager = google.tagmanager("v2");

const args = process.argv.slice(2); // remove the first two elements

export const downloadContainer = async (enableProcessing, enableDiff) => {
  const credentials = JSON.parse(readFileSync("./gcp-sa-key.json"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/tagmanager.readonly"],
  });

  const authClient = await auth.getClient();

  // get all workspaces
  const parent = `accounts/${process.env.ACCOUNT_ID}/containers/${process.env.CONTAINER_ID}`;
  const workspaces = await tagmanager.accounts.containers.workspaces.list({
    auth: authClient,
    parent,
  });

  // write workspaces to file in the workspaces folder
  mkdirSync("workspaces", { recursive: true });
  await writeFile(
    join("workspaces", "workspaces.json"),
    JSON.stringify(workspaces.data, null, 2)
  );

  // check and delete non-existing workspaces
  const workspaceFolders = readdirSync("workspaces").filter((folder) => {
    return statSync(join("workspaces", folder)).isDirectory();
  });
  const workspaceIds = workspaces.data.workspace.map(
    (workspace) => workspace.workspaceId
  );

  // Log workspace IDs and folders for debugging
  console.log("Workspace IDs: ", workspaceIds);
  console.log("Workspace Folders: ", workspaceFolders);

  // remove workspaces if they are not active in tagmanager
  for (const folder of workspaceFolders) {
    const folderId = folder.split("-")[0];
    if (!workspaceIds.includes(folderId)) {
      rmdirSync(join("workspaces", folder), { recursive: true });
    }
  }

  // look through the workspaces
  for (const workspace of workspaces.data.workspace) {
    const workspaceParent = `${parent}/workspaces/${workspace.workspaceId}`;
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;

    // rename workspaces if they changed name
    const oldWorkspaceDir = workspaceFolders.find((folder) =>
      folder.startsWith(`${workspace.workspaceId}-`)
    );
    if (oldWorkspaceDir) {
      const newWorkspacePath = workspaceDir;
      // If the new workspace directory already exists, do not delete it
      if (!readdirSync("workspaces").includes(workspaceDir)) {
        mkdirSync(newWorkspacePath, { recursive: true });
      }
      // Rename the old workspace directory to the new workspace directory
      renameSync(join("workspaces", oldWorkspaceDir), newWorkspacePath);
    } else {
      mkdirSync(workspaceDir, { recursive: true });
    }

    // create description.md file in each workspace folder only if a description is present
    if (workspace.description) {
      await writeFile(
        join(workspaceDir, "description.md"),
        workspace.description
      );
    }

    console.log(`Processing ${workspace.workspaceId} - ${workspace.name}.`);

    // tags
    const tags = await tagmanager.accounts.containers.workspaces.tags.list({
      auth: authClient,
      parent: workspaceParent,
    });
    const tagsDir = join(workspaceDir, "tags");
    mkdirSync(tagsDir, { recursive: true });
    await writeFile(
      join(tagsDir, "tags.json"),
      JSON.stringify(tags.data, null, 2)
    );
    // Process tags
    enableProcessing && (await processTags(tagsDir, enableDiff));

    // variables
    const variables =
      await tagmanager.accounts.containers.workspaces.variables.list({
        auth: authClient,
        parent: workspaceParent,
      });
    const variablesDir = join(workspaceDir, "variables");
    mkdirSync(variablesDir, { recursive: true });
    await writeFile(
      join(variablesDir, "variables.json"),
      JSON.stringify(variables.data, null, 2)
    );
    // Process variables
    enableProcessing && (await processVariables(variablesDir, enableDiff));

    // templates
    const templates =
      await tagmanager.accounts.containers.workspaces.templates.list({
        auth: authClient,
        parent: workspaceParent,
      });
    const templatesDir = join(workspaceDir, "templates");
    mkdirSync(templatesDir, { recursive: true });
    await writeFile(
      join(templatesDir, "templates.json"),
      JSON.stringify(templates.data, null, 2)
    );
    // Process templates
    enableProcessing && (await processTemplates(templatesDir, enableDiff));
  }
};
