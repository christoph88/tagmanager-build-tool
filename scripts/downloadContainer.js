import { TagManager } from "@google-cloud/tagmanager";
const fs = require("fs").promises;

async function downloadContainer() {
  const tagManager = new TagManager();
  const parent = `accounts/${process.env.ACCOUNT_ID}/containers/${process.env.CONTAINER_ID}/workspaces/${process.env.WORKSPACE_ID}`;

  const [tags] = await tagManager.accounts.containers.workspaces.tags.list({
    parent,
  });
  const [triggers] =
    await tagManager.accounts.containers.workspaces.triggers.list({ parent });
  const [variables] =
    await tagManager.accounts.containers.workspaces.variables.list({ parent });

  await fs.writeFile("tags.json", JSON.stringify(tags, null, 2));
  await fs.writeFile("triggers.json", JSON.stringify(triggers, null, 2));
  await fs.writeFile("variables.json", JSON.stringify(variables, null, 2));
}

downloadContainer().catch(console.error);
