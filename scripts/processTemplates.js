import fs from "fs";
import path from "path";

const processTemplates = (directory) => {
  // Check if the templates directory exists in the current directory
  const templatesDir = path.join(directory, "templates");
  if (fs.existsSync(templatesDir)) {
    // Read all template files in the directory
    const templateFiles = fs
      .readdirSync(templatesDir)
      .filter((file) => file.endsWith(".js"));

    templateFiles.forEach((templateFile) => {
      // Read the template file
      const data = fs.readFileSync(
        path.join(templatesDir, templateFile),
        "utf8"
      );

      // Extract the sandboxed JavaScript code using a regular expression
      const sandboxedJsMatch = data.match(
        /___SANDBOXED_JS_FOR_WEB_TEMPLATE___\n\n([\s\S]*?)\n\n__/
      );
      if (sandboxedJsMatch?.[1]) {
        const sandboxedJs = sandboxedJsMatch[1];

        // Write the sandboxed JavaScript code to a new JavaScript file with the template name as the filename
        const filename = `${templateFile.replace(/\.js$/, "_sandboxed.js")}`;
        fs.writeFileSync(path.join(templatesDir, filename), sandboxedJs);
      } else {
        console.log(`No sandboxed JavaScript found in ${templateFile}`);
      }
    });
  }
};

export default processTemplates;
