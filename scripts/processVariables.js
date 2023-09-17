import fs from "fs";
import path from "path";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

const processVariables = async (directory) => {
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

export default processVariables;
