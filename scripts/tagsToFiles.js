const fs = require("fs");
const path = require("path");

// Get all directories in the workspaces directory
const workspaces = fs
  .readdirSync("workspaces")
  .filter((file) => fs.statSync(path.join("workspaces", file)).isDirectory());

workspaces.forEach((workspace) => {
  // Check if the tags directory exists in the current workspace
  const tagsDir = path.join("workspaces", workspace, "tags");
  if (fs.existsSync(tagsDir)) {
    // Read the JSON file
    const data = fs.readFileSync(path.join(tagsDir, "tags.json"));
    const json = JSON.parse(data);

    // Loop through all tags
    json.tag.forEach((tag) => {
      // Filter out the ones which have type "template" and key "html"
      const htmlParameter = tag.parameter?.find(
        (p) => p.type === "template" && p.key === "html"
      );

      if (htmlParameter) {
        // Remove script tags from the value
        const scriptContent = htmlParameter.value.replace(
          /<script>|<\/script>/g,
          ""
        );

        // Write the value to a new JavaScript file with the tag name as the filename
        const filename = `${tag.name.replace(/ /g, "_")}.js`;
        fs.writeFileSync(path.join(tagsDir, filename), scriptContent);
      }
    });
  }
});
