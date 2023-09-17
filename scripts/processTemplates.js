import fs from "fs";
import path from "path";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

const processTemplates = async (directory) => {
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

export default processTemplates;
