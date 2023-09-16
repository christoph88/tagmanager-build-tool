import { google } from "googleapis";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";

const tagmanager = google.tagmanager("v2");

async function downloadContainer() {
  const credentials = JSON.parse(readFileSync("./gcp-sa-key.json"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/tagmanager.readonly"],
  });

  const authClient = await auth.getClient();

  const parent = `accounts/${process.env.ACCOUNT_ID}/containers/${process.env.CONTAINER_ID}/workspaces/${process.env.WORKSPACE_ID}`;

  const tags = await tagmanager.accounts.containers.workspaces.tags.list({
    auth: authClient,
    parent,
  });

  const triggers =
    await tagmanager.accounts.containers.workspaces.triggers.list({
      auth: authClient,
      parent,
    });

  const variables =
    await tagmanager.accounts.containers.workspaces.variables.list({
      auth: authClient,
      parent,
    });

  const workspaces = await tagmanager.accounts.containers.workspaces.list({
    auth: authClient,
    parent: `accounts/${process.env.ACCOUNT_ID}/containers/${process.env.CONTAINER_ID}`,
  });

  await writeFile("tags.json", JSON.stringify(tags.data, null, 2));
  await writeFile("triggers.json", JSON.stringify(triggers.data, null, 2));
  await writeFile("variables.json", JSON.stringify(variables.data, null, 2));
  await writeFile("workspaces.json", JSON.stringify(workspaces.data, null, 2));
}

downloadContainer().catch(console.error);
