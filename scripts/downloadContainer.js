import { google } from "googleapis";
import { readFileSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { join } from "path";

const tagmanager = google.tagmanager("v2");

async function downloadContainer() {
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

  // look through the workspaces
  for (const workspace of workspaces.data.workspace) {
    const workspaceParent = `${parent}/workspaces/${workspace.workspaceId}`;
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    mkdirSync(workspaceDir, { recursive: true });

    // tags
    const tags = await tagmanager.accounts.containers.workspaces.tags.list({
      auth: authClient,
      parent: workspaceParent,
    });
    mkdirSync(workspaceDir + "/tags", { recursive: true });
    await writeFile(
      join(workspaceDir, "tags.json"),
      JSON.stringify(tags.data, null, 2)
    );

    // triggers
    const triggers =
      await tagmanager.accounts.containers.workspaces.triggers.list({
        auth: authClient,
        parent: workspaceParent,
      });
    mkdirSync(workspaceDir + "/triggers", { recursive: true });
    await writeFile(
      join(workspaceDir, "triggers.json"),
      JSON.stringify(triggers.data, null, 2)
    );

    // variables
    const variables =
      await tagmanager.accounts.containers.workspaces.variables.list({
        auth: authClient,
        parent: workspaceParent,
      });
    mkdirSync(workspaceDir + "/variables", { recursive: true });
    await writeFile(
      join(workspaceDir, "variables.json"),
      JSON.stringify(variables.data, null, 2)
    );

    // templates
    const templates =
      await tagmanager.accounts.containers.workspaces.templates.list({
        auth: authClient,
        parent: workspaceParent,
      });
    mkdirSync(workspaceDir + "/templates", { recursive: true });
    await writeFile(
      join(workspaceDir, "templates.json"),
      JSON.stringify(templates.data, null, 2)
    );
  }
}

downloadContainer().catch(console.error);
