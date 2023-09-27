import dotenv from "dotenv";
dotenv.config();
import { downloadContainer } from "./scripts/downloadContainer.js";
import { uploadChanges } from "./scripts/uploadChanges.js";
import { Command } from "commander";
const program = new Command();

program.version("0.0.1").description("Tagmanager build tool");

program
  .command("pull")
  .description("Download container")
  .option("-p, --enableProcessing", "Enable processing")
  .option("-d, --enableDiff", "Enable processing")
  .action((options) => {
    console.log(options);
    downloadContainer(options.enableProcessing, options.enableDiff);
  });

program
  .command("build")
  .description("Build files and make them ready for upload.")
  .action((options) => {
    console.log(options);
  });

program
  .command("push")
  .description(
    "Upload changes to tagmanager. Include a comma seperated list of paths to process or omit to process all."
  )
  .option("-t, --tags [tags...]", "Ids of tags to upload")
  .option("-v, --variables [variables...]", "Ids of variables to upload")
  .option("-m, --templates [templates...]", "Ids of templates to upload")
  .option("-a, --all", "Upload all tags, variables and templates")
  .action((options) => {
    console.log(options);
    if (options.tags || options.variables || options.templates) {
      uploadChanges(options.tags, options.variables, options.templates);
      return;
    }
    if (options.all) {
      uploadChanges(true, true, true);
      return;
    }
    console.error("At least one option is required");
    process.exit(1);
  });

program.parse();
