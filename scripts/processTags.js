import fs from "fs";
import path from "path";

const processTags = (directory) => {
  // Check if the tags directory exists in the current directory
  const tagsDir = directory;
  if (fs.existsSync(tagsDir)) {
    // Read the JSON file
    const data = fs.readFileSync(path.join(tagsDir, "tags.json"));
    const json = JSON.parse(data);

    // Loop through all tags
    json.tag.forEach((tag) => {
      // Filter out the ones which have type 'template' and key 'html'
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
};

export default processTags;
