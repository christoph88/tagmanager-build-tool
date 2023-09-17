import fs from "fs";
import path from "path";

const processTemplates = (directory) => {
  // Check if the templates directory exists in the current directory
  const templatesDir = directory;
  if (fs.existsSync(templatesDir)) {
    // Check if templates.json exists in the directory
    const templateFile = path.join(templatesDir, "templates.json");
    if (fs.existsSync(templateFile)) {
      // Read the template file
      const data = fs.readFileSync(templateFile, "utf8");
      const json = JSON.parse(data);

      // Loop through all templates
      json.template.forEach((template) => {
        // Get the template data
        const templateData = template.templateData;

        // Write the template data to a file
        fs.writeFileSync(
          path.join(templatesDir, `${template.name}.tpl`),
          templateData
        );
      });
    }
  }
};

export default processTemplates;
