const fs = require("fs");
const path = require("path");

// Get all directories in the workspaces directory
const workspaces = fs
  .readdirSync("workspaces")
  .filter((file) => fs.statSync(path.join("workspaces", file)).isDirectory());

workspaces.forEach((workspace) => {
  // Check if the variables directory exists in the current workspace
  const variablesDir = path.join("workspaces", workspace, "variables");
  if (fs.existsSync(variablesDir)) {
    // Read the JSON file
    const data = fs.readFileSync(path.join(variablesDir, "variables.json"));
    const json = JSON.parse(data);

    // Loop through all variables
    json.variable.forEach((variable) => {
      // Filter out the ones which have type "jsm"
      if (variable.type === "jsm") {
        // Find the parameter with type "template" and key "javascript"
        const jsParameter = variable.parameter?.find(
          (p) => p.type === "template" && p.key === "javascript"
        );

        if (jsParameter) {
          // Write the value to a new JavaScript file with the variable name as the filename
          const filename = `${variable.name.replace(/ /g, "_")}.js`;
          fs.writeFileSync(
            path.join(variablesDir, filename),
            jsParameter.value
          );
        }
      }
    });
  }
});
