import fs from "fs";
import { google } from "googleapis";
const tagmanager = google.tagmanager("v2");

async function uploadTags() {
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
    console.log(`Uploading tags from ${workspaceDir}`);

    // Load the tags from a JSON file
    const tags = JSON.parse(
      await fs.promises.readFile(`${workspaceDir}/tags/tags.json`, "utf8")
    );

    // Create or update each tag
    if (Array.isArray(tags.tag)) {
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
    } else {
      console.log("No templates found!");
    }
  }
}

async function uploadVariables() {
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

  // iterate over workspaces and upload a new version of a variable
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading variables from ${workspaceDir}`);

    // Load the variables from a JSON file
    const variables = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/variables/variables.json`,
        "utf8"
      )
    );

    // Create or update each variable
    if (Array.isArray(variables.variable)) {
      for (const variable of variables.variable) {
        const variablesDir = workspaceDir + "/variables";
        // Filter out HTML variables only
        const jsVariable = variable.type === "jsm";

        if (jsVariable) {
          console.log(`Process Variable ${variable.name}.`);
          // Already start reading variable file
          const variableFile = await fs.promises.readFile(
            `${variablesDir}/${variable.name.replace(/ /g, "_")}.js`,
            "utf8"
          );

          // Construct the variable object to match the Google variable Manager API request format
          const requestVariable = {
            path: variable.path,
            accountId: variable.accountId,
            containerId: variable.containerId,
            workspaceId: variable.workspaceId,
            variableId: variable.variableId,
            name: variable.name,
            parameter: variable.parameter,
            consentSettings: variable.consentSettings,
            monitoringMetadata: variable.monitoringMetadata,
            priority: variable.priority,
            type: variable.type,
          };

          const jsParameterIndex = requestVariable.parameter?.findIndex((p) => {
            return p.type === "template" && p.key === "javascript";
          });

          requestVariable.parameter[jsParameterIndex].value = variableFile;

          try {
            const response =
              await tagmanager.accounts.containers.workspaces.variables.update({
                auth: authClient,
                fingerprint: variable.fingerprint,
                path: variable.path,
                requestBody: requestVariable,
              });
            console.log(`Variable ${variable.name} uploaded successfully.`);
            console.log(response.status);
          } catch (error) {
            console.error(`Failed to upload variable ${variable.name}.`);
            console.error(JSON.stringify(error.errors, null, 2));
            console.error(error.status);
          }
        }
      }
    } else {
      console.log("No templates found!");
    }
  }
}

async function uploadTemplates() {
  const credentials = JSON.parse(
    await fs.promises.readFile("./gcp-sa-key.json", "utf8")
  );
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/templatemanager.edit.containers"],
  });

  const authClient = await auth.getClient();

  // get all active workspaces
  const workspaces = JSON.parse(
    await fs.promises.readFile("workspaces/workspaces.json", "utf8")
  );

  // iterate over workspaces and upload a new version of a template
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading templates from ${workspaceDir}`);

    // Load the templates from a JSON file
    const templates = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/templates/templates.json`,
        "utf8"
      )
    );

    // Create or update each template
    if (Array.isArray(templates.template)) {
      for (const template of templates.template) {
        const templatesDir = workspaceDir + "/templates";

        const galleryTemplate =
          typeof template.galleryReference !== "undefined";

        if (!galleryTemplate) {
          console.log(`Process Template ${template.name}.`);
          // Already start reading  file
          const templateFile = await fs.promises.readFile(
            `${templatesDir}/${template.name.replace(/ /g, "_")}.js`,
            "utf8"
          );

          // FIXME fix uploading of templates, this still gives errors
          // Construct the template object to match the Google template Manager API request format
          const requestTemplate = {
            path: template.path,
            accountId: template.accountId,
            containerId: template.containerId,
            workspaceId: template.workspaceId,
            templateId: template.templateId,
            name: template.name,
            templateData: template.templateData,
          };

          requestTemplate.templateData = templateFile;

          try {
            const response =
              await tagmanager.accounts.containers.workspaces.template.update({
                auth: authClient,
                fingerprint: template.fingerprint,
                path: template.path,
                requestBody: requestTemplate,
              });
            console.log(`Template ${template.name} uploaded successfully.`);
            console.log(response.status);
          } catch (error) {
            console.error(`Failed to upload template ${template.name}.`);
            // FIXME remove full error
            console.error(JSON.stringify(error, null, 2));
            console.error(JSON.stringify(error.errors, null, 2));
            console.error(error.status);
          }
        }
      }
    } else {
      console.log("No templates found!");
    }
  }
}

const uploadChanges = async () => {
  await uploadTags();
  await uploadVariables();
  await uploadTemplates();
};

uploadChanges();
