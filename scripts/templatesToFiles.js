const fs = require("fs");
const path = require("path");

// Get all directories in the workspaces directory
const workspaces = fs
  .readdirSync("workspaces")
  .filter((file) => fs.statSync(path.join("workspaces", file)).isDirectory());

workspaces.forEach((workspace) => {
  // Check if the templates directory exists in the current workspace
  const templatesDir = path.join("workspaces", workspace, "templates");
  if (fs.existsSync(templatesDir)) {
    // Read the JSON file
    const data = fs.readFileSync(path.join(templatesDir, "templates.json"));
    const json = JSON.parse(data);

    // Loop through all templates
    json.template.forEach((template) => {
      // Get the templateData
      const templateData = template.templateData;

      // Write the templateData to a new JavaScript file with the template name as the filename
      const filename = `${template.name.replace(/ /g, "_")}.js`;
      fs.writeFileSync(path.join(templatesDir, filename), templateData);
    });
  }
});
