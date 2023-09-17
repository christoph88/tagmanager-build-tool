import fs from "fs";
import path from "path";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

const processTags = async (directory) => {
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

export default processTags;
