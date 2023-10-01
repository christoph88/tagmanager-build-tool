import fs from "fs";
import { google } from "googleapis";
const tagmanager = google.tagmanager("v2");

async function uploadTags(tagArray) {
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

  // iterate over dist workspaces and upload a new version of a tag
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `dist/workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading tags from ${workspaceDir}`);

    // TODO you need this
    // Get an array of all files in the tags/ dir
    const tagsDir = `${workspaceDir}/tags`;
    let tagsFiles;

    // Check if the directory exists
    if (fs.existsSync(tagsDir)) {
      tagsFiles = await fs.promises.readdir(tagsDir);

      // TODO remove
      console.log("tagsFiles", tagsFiles);

      let tags;
      // cmd argument can be passed without arguments
      if (tagArray === true) {
        console.log("Upload all tags.");
        tags = tagsFiles;
        console.log(tags);
      }

      // TODO fix this because tagsfiles are only filenames
      // if paths or filenames are passed use those
      if (Array.isArray(tagsFiles) && Array.isArray(tagArray)) {
        console.log(`Upload selected tags: ${tagArray.join(", ")}`);
        tags = tagsFiles.filter((tag) => {
          return tagArray.includes(tag.tagId);
        });
      }

      // Create or update each tag
      if (Array.isArray(tags) && tags.length > 0) {
        for (const tag of tags) {
          const tagsDir = workspaceDir + "/tags";
          // Filter out HTML tags only

          console.log(`Upload Tag ${tag.name}.`);

          // Already start reading tag file
          const tagName = tag;
          const requestTag = await fs.promises.readFile(
            `${tagsDir}/${tagName}`,
            "utf8"
          );

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
      } else {
        console.log("No tags found!");
      }
    }
  }
}

async function uploadVariables(variableArray) {
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
    const workspaceDir = `dist/workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading variables from ${workspaceDir}`);

    // Get an array of all files in the variables/ dir
    const variablesDir = `${workspaceDir}/variables`;
    if (fs.existsSync(variablesDir)) {
      const variablesFiles = await fs.promises.readdir(variablesDir);

      let variables;
      // cmd argument can be passed without arguments
      if (variableArray) {
        console.log("Upload all variables.");
        variables = variablesFiles;
        console.log(variables);
      }

      // TODO fix this with filenames
      // if paths or filenames are passed use those
      if (Array.isArray(variablesFiles) && Array.isArray(variableArray)) {
        console.log(`Upload selected variables: ${variableArray.join(", ")}`);
        variables = variablesFiles.filter((variable) => {
          return variableArray.includes(variable.variableId);
        });
      }

      // Create or update each tag
      if (Array.isArray(variables) && variables.length > 0) {
        for (const variable of variables) {
          const variablesDir = workspaceDir + "/variables";

          console.log(`Upload Variable ${variable.name}.`);
          // Already start reading variable file
          const variableName = variable;
          const requestVariable = await fs.promises.readFile(
            `${variablesDir}/${variableName}`,
            "utf8"
          );

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
      } else {
        console.log("No variables found!");
      }
    }
  }
}

async function uploadTemplates(templateArray) {
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

  // iterate over workspaces and upload a new version of a template
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `dist/workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading templates from ${workspaceDir}`);

    // Get an array of all files in the templates/ dir
    const templatesDir = `${workspaceDir}/templates`;
    if (fs.existsSync(templatesDir)) {
      const templatesFiles = await fs.promises.readdir(templatesDir);

      let templates;
      // cmd argument can be passed without arguments
      if (templateArray === true) {
        console.log("Upload all templates.");
        templates = templatesFiles;
        console.log(templates);
      }

      // TODO fix
      // if paths or filenames are passed use those
      if (Array.isArray(templatesFiles) && Array.isArray(templateArray)) {
        console.log(`Upload selected templates: ${templateArray.join(", ")}`);
        templates = templatesFiles.filter((template) => {
          return templateArray.includes(template.templateId);
        });
      }

      // Create or update each tag
      if (Array.isArray(templates) && templates.length > 0) {
        for (const template of templates) {
          // Create or update each template
          const templatesDir = workspaceDir + "/templates";

          console.log(`Upload Template ${template.name}.`);

          // Already start reading template file
          const templateName = template;
          const requestTemplate = await fs.promises.readFile(
            `${templatesDir}/${templateName}`,
            "utf8"
          );

          try {
            const response =
              await tagmanager.accounts.containers.workspaces.templates.update({
                auth: authClient,
                path: template.path,
                fingerprint: template.fingerprint,
                requestBody: requestTemplate,
              });
            console.log(`Template ${template.name} uploaded successfully.`);
            console.log(response.status);
          } catch (error) {
            console.error(`Failed to upload template ${template.name}.`);
            console.error(JSON.stringify(error.errors, null, 2));
            console.error(error.status);
          }
        }
      } else {
        console.log("No templates found!");
      }
    }
  }
}

export const uploadChanges = async (tags, variables, templates) => {
  tags && (await uploadTags(tags));
  variables && (await uploadVariables(variables));
  templates && (await uploadTemplates(templates));
};
