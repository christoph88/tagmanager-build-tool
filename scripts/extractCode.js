import fs from "fs";
import path from "path";
import util from "util";

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
                const newFileContent = scriptContent;

                const fileContents = newFileContent;

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
                const newFileContent = jsParameter.value;

                let fileContents = newFileContent;
                fileContents = "var gtmVariable = " + fileContents;

                // TODO move this to a seperate ascript so it can be reused for tags and templates
                const getHandlebarsVariables = (str) => {
                  const regex = /\{\{([^}]+)\}\}/g;
                  let match;
                  const matches = [];

                  while ((match = regex.exec(str)) !== null) {
                    matches.push(match[1].trim());
                  }

                  return matches;
                };

                let handlebarsVariables = getHandlebarsVariables(fileContents);

                const processHandlebarsVariables = (str, variables) => {
                  let result = str;
                  variables.forEach((variable) => {
                    const regex = new RegExp(
                      `\\{\\{\\s*${variable}\\s*\\}\\}`,
                      "g"
                    );
                    // Adding the original handlebar variable as a comment before replacing it
                    result = result.replace(
                      regex,
                      `/* {{${variable}}} */ "${variable}"`
                    );
                  });
                  return result;
                };

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
              )}.tpl`;
              const filePath = path.join(templatesDir, filename);
              const newFileContent = template.templateData;

              // TODO only get the sandboxed javascript
              // const fileContent = `...`; // Replace this with your file content

              // const sections = fileContent.split('___');
              // const sandboxedJSCode = sections.find(section => section.startsWith('SANDBOXED_JS_FOR_WEB_TEMPLATE')).split('\n').slice(1).join('\n');
              // console.log(sandboxedJSCode);

              const fileContents = newFileContent;

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
