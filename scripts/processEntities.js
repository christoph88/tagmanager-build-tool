import fs from "fs";
import path from "path";
import util from "util";
import Diff from "diff";

const writeFile = util.promisify(fs.writeFile);

const diffLines = (existingFileContent, newFileContent) => {
  const changes = Diff.diffLines(existingFileContent, newFileContent, {
    newLineIsToken: true,
  });

  const fileDiff = changes
    .map((change) => {
      if (change.added) {
        return `+ ${change.value}`;
      } else if (change.removed) {
        return `- ${change.value}`;
      } else {
        return `  ${change.value}`;
      }
    })
    .join("\n");
  return fileDiff;
};

export const processTags = async (directory) => {
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
                const scriptContent = htmlParameter.value.replace(
                  /<script>|<\/script>/g,
                  ""
                );

                // Write the value to a new JavaScript file with the variable name as the filename
                const filename = `${tag.name.replace(/ /g, "_")}.js`;
                const filePath = path.join(tagsDir, filename);
                const newFileContent = scriptContent;

                let fileDiff;
                // If file already exists, do a diff
                if (fs.existsSync(filePath)) {
                  const existingFileContent = fs.readFileSync(filePath, "utf8");
                  fileDiff = diffLines(existingFileContent, newFileContent);
                }

                const fileContents = fileDiff || newFileContent;

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

export const processTemplates = async (directory) => {
  return await new Promise((resolve, reject) => {
    // Check if the variables directory exists in the current directory
    const templatesDir = directory;
    console.log(templatesDir);
    if (fs.existsSync(templatesDir)) {
      // Read the JSON file
      const data = fs.readFileSync(path.join(templatesDir, "templates.json"));
      const json = JSON.parse(data);

      // Loop through all variables
      if (json.template) {
        Promise.all(
          json.template.map(async (template) => {
            // Write the value to a new JavaScript file with the variable name as the filename
            const filename = `${template.name.replace(/ /g, "_")}.js`;
            const filePath = path.join(templatesDir, filename);
            const newFileContent = template.templateData;

            let fileDiff;
            // If file already exists, do a diff
            if (fs.existsSync(filePath)) {
              const existingFileContent = fs.readFileSync(filePath, "utf8");
              fileDiff = diffLines(existingFileContent, newFileContent);
            }

            const fileContents = fileDiff || newFileContent;

            await writeFile(filePath, fileContents);

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
                const filePath = path.join(variablesDir, filename);
                const newFileContent = jsParameter.value;

                let fileDiff;
                // If file already exists, do a diff
                if (fs.existsSync(filePath)) {
                  const existingFileContent = fs.readFileSync(filePath, "utf8");
                  fileDiff = diffLines(existingFileContent, newFileContent);
                }

                const fileContents = fileDiff || newFileContent;

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
