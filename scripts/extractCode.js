import fs from "fs";
import path from "path";
import util from "util";
import {
  getHandlebarsVariables,
  processHandlebarsVariables,
} from "./handlebars.js";

const writeFile = util.promisify(fs.writeFile);

export const extractTags = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the variables directory exists in the current directory
    const tagsDir = directory;
    console.log(tagsDir);
    if (fs.existsSync(tagsDir)) {
      // Read the JSON file
      const data = fs.readFileSync(path.join(tagsDir, "tags.json"));
      const json = JSON.parse(data);

      // Loop through all variables
      if (json.tag) {
        Promise.all(
          json.tag.map(async (tag) => {
            // Filter out the ones which have type 'jsm'
            if (tag.type === "html") {
              // Find the parameter with type 'template' and key 'javascript'
              const htmlParameter = tag.parameter?.find(
                (p) => p.type === "template" && p.key === "html"
              );

              if (htmlParameter) {
                // Remove script tags from the value
                const scriptContent = htmlParameter.value;

                // Write the value to a new JavaScript file with the variable name as the filename
                const filename = `${tag.tagId}__${tag.name.replace(
                  /( |\/)/g,
                  "_"
                )}.html`;
                const filePath = path.join(tagsDir, filename);

                let fileContents = scriptContent;

                let handlebarsVariables = getHandlebarsVariables(fileContents);

                fileContents = processHandlebarsVariables(
                  fileContents,
                  handlebarsVariables
                );

                await writeFile(filePath, fileContents);
                return;
              }
            }
            await Promise.resolve();
          })
        )
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    } else {
      reject("Directory does not exist");
    }
  });
};

export const extractVariables = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the variables directory exists in the current directory
    const variablesDir = directory;
    console.log(variablesDir);
    if (fs.existsSync(variablesDir)) {
      // Read the JSON file
      const data = fs.readFileSync(path.join(variablesDir, "variables.json"));
      const json = JSON.parse(data);

      // Loop through all variables
      if (json.variable) {
        Promise.all(
          json.variable.map(async (variable) => {
            // Filter out the ones which have type 'jsm'
            if (variable.type === "jsm") {
              // Find the parameter with type 'template' and key 'javascript'
              const jsParameter = variable.parameter?.find(
                (p) => p.type === "template" && p.key === "javascript"
              );

              if (jsParameter) {
                // Write the value to a new JavaScript file with the variable name as the filename
                const filename = `${
                  variable.variableId
                }__${variable.name.replace(/( |\/)/g, "_")}.js`;
                const filePath = path.join(variablesDir, filename);
                const jsContent = jsParameter.value;

                let fileContents = jsContent;
                fileContents = "var gtmVariable = " + fileContents;

                let handlebarsVariables = getHandlebarsVariables(fileContents);

                fileContents = processHandlebarsVariables(
                  fileContents,
                  handlebarsVariables
                );

                await writeFile(filePath, fileContents);
                return;
              }
            }
            await Promise.resolve();
          })
        )
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    } else {
      reject("Directory does not exist");
    }
  });
};

export const extractTemplates = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the templates directory exists in the current directory
    const templatesDir = directory;
    console.log(templatesDir);
    if (fs.existsSync(templatesDir)) {
      // Read the JSON file
      const data = fs.readFileSync(path.join(templatesDir, "templates.json"));
      const json = JSON.parse(data);

      // Loop through all templates
      if (json.template) {
        Promise.all(
          json.template.map(async (template) => {
            // Filter out the ones which not belong to a gallery
            if (typeof template.galleryReference === "undefined") {
              // Write the value to a new JavaScript file with the variable name as the filename
              // TODO change filename to js
              const filename = `${template.templateId}__${template.name.replace(
                /( |\/)/g,
                "_"
              )}.js`;
              const filePath = path.join(templatesDir, filename);

              const templateContent = template.templateData;

              // Get only the sandboxed js
              const sections = templateContent.split("___");
              const sandboxedJSCode = sections
                .find((section) =>
                  section.startsWith("SANDBOXED_JS_FOR_WEB_TEMPLATE")
                )
                .split("\n")
                .slice(1)
                .join("\n");

              let fileContents = sandboxedJSCode;

              let handlebarsVariables = getHandlebarsVariables(fileContents);

              fileContents = processHandlebarsVariables(
                fileContents,
                handlebarsVariables
              );

              await writeFile(filePath, fileContents);
              return;
            }
            await Promise.resolve();
          })
        )
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    } else {
      reject("Directory does not exist");
    }
  });
};
