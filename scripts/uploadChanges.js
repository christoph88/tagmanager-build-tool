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

  // iterate over workspaces and upload a new version of a tag
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading tags from ${workspaceDir}`);

    // Load the tags from a JSON file
    const tagsFile = JSON.parse(
      await fs.promises.readFile(`${workspaceDir}/tags/tags.json`, "utf8")
    );

    let tags;
    // cmd argument can be passed without arguments
    if (tagArray === true) {
      console.log("Process all tags.");
      tags = tagsFile.tag;
    }

    // if paths or filenames are passed use those
    if (Array.isArray(tagsFile.tag) && Array.isArray(tagArray)) {
      console.log(`Process selected tags: ${tagArray.join(", ")}`);
      tags = tagsFile.tag.filter((tag) => {
        return tagArray.includes(tag.tagId);
      });
    }

    // Create or update each tag
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        const tagsDir = workspaceDir + "/tags";
        // Filter out HTML tags only
        const htmlTag = tag.type === "html";

        if (htmlTag) {
          console.log(`Process Tag ${tag.name}.`);
          // Already start reading tag file
          const tagFile = await fs.promises.readFile(
            `${tagsDir}/${tag.tagId}__${tag.name.replace(/ /g, "_")}.html`,
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
      console.log("No tags found!");
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
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading variables from ${workspaceDir}`);

    // Load the variables from a JSON file
    const variablesFile = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/variables/variables.json`,
        "utf8"
      )
    );
    let variables;
    // cmd argument can be passed without arguments
    if (variableArray) {
      console.log("Process all tags.");
      variables = variablesFile.variable;
    }

    // if paths or filenames are passed use those
    if (Array.isArray(variablesFile.variable) && Array.isArray(variableArray)) {
      console.log(`Process selected variables: ${variableArray.join(", ")}`);
      variables = variablesFile.variable.filter((variable) => {
        return variableArray.includes(variable.variableId);
      });
    }

    // Create or update each tag
    if (Array.isArray(variables) && variables.length > 0) {
      for (const variable of variables) {
        const variablesDir = workspaceDir + "/variables";
        // Filter out HTML variables only
        const jsVariable = variable.type === "jsm";

        if (jsVariable) {
          console.log(`Process Variable ${variable.name}.`);
          // Already start reading variable file
          const variableFile = await fs.promises.readFile(
            `${variablesDir}/${variable.variableId}__${variable.name.replace(
              / /g,
              "_"
            )}.js`,
            "utf8"
          );

          const reverseProcessHandlebarsVariables = (str) => {
            let result = str;
            const regex = /\/\*\s\{\{(.+?)\}\}\s\*\/\s"(.+?)"/g;
            let match;

            while ((match = regex.exec(str)) !== null) {
              const variable = match[1].trim();
              const replacement = `{{${variable}}}`;
              result = result.replace(match[0], replacement);
            }

            return result;
          };

          // TODO move this to a seperate script file so it can be reused for templates and tags
          let processedValue = reverseProcessHandlebarsVariables(
            variableFile
          ).replace("var gtmVariable = ", "");
          console.log(processedValue);

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

          requestVariable.parameter[jsParameterIndex].value = processedValue;

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
      console.log("No variables found!");
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
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`Uploading templates from ${workspaceDir}`);

    // Load the templates from a JSON file
    const templatesFile = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/templates/templates.json`,
        "utf8"
      )
    );

    let templates;
    // cmd argument can be passed without arguments
    if (templateArray === true) {
      console.log("Process all templates.");
      templates = templatesFile.template;
    }

    // if paths or filenames are passed use those
    if (Array.isArray(templatesFile.template) && Array.isArray(templateArray)) {
      console.log(`Process selected templates: ${templateArray.join(", ")}`);
      templates = templatesFile.template.filter((template) => {
        return templateArray.includes(template.templateId);
      });
    }

    // Create or update each tag
    if (Array.isArray(templates) && templates.length > 0) {
      for (const template of templates) {
        // Create or update each template
        const templatesDir = workspaceDir + "/templates";

        const galleryTemplate =
          typeof template.galleryReference !== "undefined";

        if (!galleryTemplate) {
          console.log(`Process Template ${template.name}.`);

          // Already start reading  file and merge the output in one string
          const templateFile = (
            await fs.promises.readFile(
              `${templatesDir}/${template.templateId}__${template.name.replace(
                / /g,
                "_"
              )}.tpl`,
              "utf8"
            )
          ).toString();

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
      }
    } else {
      console.log("No templates found!");
    }
  }
}

export const uploadChanges = async (tags, variables, templates) => {
  tags && (await uploadTags(tags));
  variables && (await uploadVariables(variables));
  templates && (await uploadTemplates(templates));
};
