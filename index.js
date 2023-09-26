require("dotenv").config();
import { downloadContainer } from "./scripts/downloadContainer.js";
import { uploadChanges } from "./scripts/uploadChanges.js";
import { Command } from "commander";
const program = new Command();

program.version("0.0.1").description("Tagmanager build tool");

program
  .command("download")
  .description("Download container")
  .option("-p, --enableProcessing <boolean>", "Enable processing", false)
  .action((options) => {
    console.log(options);
    downloadContainer(options.enableProcessing);
  });

program
  .command("upload")
  .description("Upload changes")
  .option("-t, --tags <tags>", "Tags to upload", false)
  .option("-v, --variables <variables>", "Variables to upload", false)
  .option("-m, --template <template>", "Template to upload", true)
  .action((options) => {
    // TODO if options contain * upload all of them
    // TODO add a filter to the templates which filters out the selection here
    console.log(options);
    uploadChanges(options.tags, options.variables, options.templates);
  });

program.parse();
