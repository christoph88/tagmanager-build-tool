import dotenv from "dotenv";
dotenv.config();
import { downloadContainer } from "./scripts/downloadContainer.js";
import { uploadChanges } from "./scripts/uploadChanges.js";
import { Command } from "commander";
const program = new Command();

program.version("0.0.1").description("Tagmanager build tool");

program
  .command("download")
  .description("Download container")
  .option("-p, --enableProcessing", "Enable processing")
  .option("-d, --enableDiff", "Enable processing")
  .action((options) => {
    console.log(options);
    downloadContainer(options.enableProcessing, options.enableDiff);
  });

program
  .command("upload")
  .description(
    "Upload changes to tagmanager. Include a comma seperated list of paths to process or omit to process all."
  )
  .option("-t, --tags [tags...]", "Paths of tags to upload")
  .option("-v, --variables [variables...]", "Paths of variables to upload")
  .option("-m, --templates [templates...]", "Paths of templates to upload")
  .option("-a, --all", "Upload all tags, variables and templates")
  .action((options) => {
    // TODO fix it so you can select which templates to upload
    console.log(options);
    if (options.all) {
      // uploadChanges(true, true, true);
      return;
    }
    if (options.test) {
      // uploadChanges(false, false, true);
      return;
    }
    // uploadChanges(options.tags, options.variables, options.templates);
  });

program.parse();
