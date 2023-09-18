import fs from "fs";
import path from "path";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

export const processTags = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the tags directory exists in the current directory
    const tagsDir = directory;
    console.log(tagsDir);
    if (fs.existsSync(tagsDir)) {
      // Read the JSON file
      const data = fs.readFileSync(path.join(tagsDir, "tags.json"));
      const json = JSON.parse(data);

      // Loop through all tags
      if (json.tag) {
        for (const tag of json.tag) {
          // Filter out the ones which have type 'template' and key 'html'
          if (tag.type === "html") {
            const htmlParameter = tag.parameter.find((p) => {
              return p.type === "template" && p.key === "html";
            });

            // Remove script tags from the value
            const scriptContent = htmlParameter.value.replace(
              /<script>|<\/script>/g,
              ""
            );

            // Write the value to a new JavaScript file with the tag name as the filename
            const filename = `${tag.name.replace(/ /g, "_")}.js`;
            writeFile(path.join(tagsDir, filename), scriptContent)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          }
        }
      } else {
        resolve();
      }
    }
  });
};

export const processTemplates = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the templates directory exists in the current directory
    const templatesDir = directory;
    console.log(templatesDir);
    if (fs.existsSync(templatesDir)) {
      // Check if templates.json exists in the directory
      const templateFile = path.join(templatesDir, "templates.json");
      if (fs.existsSync(templateFile)) {
        // Read the template file
        const data = fs.readFileSync(templateFile, "utf8");
        const json = JSON.parse(data);

        // Check if json.template exists before proceeding
        if (json.template) {
          // Loop through all templates
          Promise.all(
            json.template.map(async (template) => {
              // Get the template data
              const templateData = template.templateData;

              // Write the template data to a file
              await writeFile(
                path.join(templatesDir, `${template.name}.tpl`),
                templateData
              );
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
      }
    }
  });
};

export const processVariables = async (directory) => {
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
                const filename = `${variable.name.replace(/ /g, "_")}.js`;
                await writeFile(
                  path.join(variablesDir, filename),
                  jsParameter.value
                );
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
