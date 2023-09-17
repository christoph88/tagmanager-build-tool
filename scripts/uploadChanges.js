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

    // Load the tags from a JSON file
    const tags = JSON.parse(
      readFileSync(
        `workspaces/${workspace.workspaceId}-${workspace.name}/tags/tags.json`,
        "utf8"
      )
    );

    // Create or update each tag
    for (const tag of tags.tag) {
      await tagmanager.accounts.containers.workspaces.tags.create({
        auth: authClient,
        parent: workspacePath,
        requestBody: tag,
      });
    }
  }
}
