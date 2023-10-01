import path from "path";
import fs from "fs";
import { reverseProcessHandlebarsVariables } from "./handlebars.js";

async function buildTags() {
  // get all active workspaces
  const workspaces = JSON.parse(
    await fs.promises.readFile("workspaces/workspaces.json", "utf8")
  );

  // iterate over workspaces
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`\n\nBuilding tags from ${workspaceDir}`);

    // Load the tags from a JSON file
    const tagsFile = JSON.parse(
      await fs.promises.readFile(`${workspaceDir}/tags/tags.json`, "utf8")
    );

    const tags = tagsFile.tag;

    // Build each tag
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        const tagsDir = workspaceDir + "/tags";
        // Filter out HTML tags only
        const htmlTag = tag.type === "html";

        if (htmlTag) {
          console.log(`Build Tag ${tag.name}.`);
          // Already start reading tag file
          const tagName = `${tag.tagId}__${tag.name.replace(/ /g, "_")}`;
          const tagFile = await fs.promises.readFile(
            `${tagsDir}/${tagName}.html`,
            "utf8"
          );

          let processedValue = reverseProcessHandlebarsVariables(tagFile);

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

          requestTag.parameter[htmlParameterIndex].value = processedValue;

          // Write the requestTag to the dist folder
          const outputDir = path.dirname(`dist/${tagsDir}/${tagName}.json`);
          await fs.promises.mkdir(outputDir, { recursive: true });

          await fs.promises.writeFile(
            `dist/${tagsDir}/${tagName}.json`,
            JSON.stringify(requestTag, null, 2)
          );
        }
      }
    } else {
      console.log("No tags found!");
    }
  }
}

async function buildVariables() {
  // get all active workspaces
  const workspaces = JSON.parse(
    await fs.promises.readFile("workspaces/workspaces.json", "utf8")
  );

  // iterate over workspaces
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`\n\nBuilding variables from ${workspaceDir}`);

    // Load the variables from a JSON file
    const variablesFile = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/variables/variables.json`,
        "utf8"
      )
    );
    const variables = variablesFile.variable;

    // Create or update each tag
    if (Array.isArray(variables) && variables.length > 0) {
      for (const variable of variables) {
        const variablesDir = workspaceDir + "/variables";
        // Filter out HTML variables only
        const jsVariable = variable.type === "jsm";

        if (jsVariable) {
          console.log(`Build Variable ${variable.name}.`);
          // Already start reading variable file
          const variableName = `${variable.variableId}__${variable.name.replace(
            / /g,
            "_"
          )}`;
          const variableFile = await fs.promises.readFile(
            `${variablesDir}/${variableName}.js`,
            "utf8"
          );

          let processedValue = reverseProcessHandlebarsVariables(
            variableFile
          ).replace("var gtmVariable = ", "");

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

          const outputDir = path.dirname(
            `dist/${variablesDir}/${variableName}.json`
          );
          await fs.promises.mkdir(outputDir, { recursive: true });

          await fs.promises.writeFile(
            `dist/${variablesDir}/${variableName}.json`,
            JSON.stringify(requestVariable, null, 2)
          );
        }
      }
    } else {
      console.log("No variables found!");
    }
  }
}

async function buildTemplates() {
  // get all active workspaces
  const workspaces = JSON.parse(
    await fs.promises.readFile("workspaces/workspaces.json", "utf8")
  );

  // iterate over workspaces
  for (const workspace of workspaces.workspace) {
    const workspaceDir = `workspaces/${workspace.workspaceId}-${workspace.name}`;
    console.log(`\n\nBuilding templates from ${workspaceDir}`);

    // Load the templates from a JSON file
    const templatesFile = JSON.parse(
      await fs.promises.readFile(
        `${workspaceDir}/templates/templates.json`,
        "utf8"
      )
    );

    let templates = templatesFile.template;

    // Create or update each tag
    if (Array.isArray(templates) && templates.length > 0) {
      for (const template of templates) {
        // Create or update each template
        const templatesDir = workspaceDir + "/templates";

        const galleryTemplate =
          typeof template.galleryReference !== "undefined";

        if (!galleryTemplate) {
          console.log(`Build Template ${template.name}.`);

          // Already start reading  file and merge the output in one string
          const templateName = `${template.templateId}__${template.name.replace(
            / /g,
            "_"
          )}`;
          const templateFile = (
            await fs.promises.readFile(
              `${templatesDir}/${templateName}.js`,
              "utf8"
            )
          ).toString();

          let processedValue = reverseProcessHandlebarsVariables(templateFile);

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

          requestTemplate.templateData = processedValue;

          const outputDir = path.dirname(
            `dist/${templatesDir}/${templateName}.json`
          );
          await fs.promises.mkdir(outputDir, { recursive: true });

          await fs.promises.writeFile(
            `dist/${templatesDir}/${templateName}.json`,
            JSON.stringify(requestTemplate, null, 2)
          );
        }
      }
    } else {
      console.log("No templates found!");
    }
  }
}

export const buildChanges = async () => {
  await buildTags();
  await buildVariables();
  await buildTemplates();
};
