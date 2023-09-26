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
  .option("-p, --enableProcessing <boolean>", "Enable processing", false)
  .action((options) => {
    console.log(options);
    downloadContainer(options.enableProcessing);
  });

program
  .command("upload")
  .description("Upload changes")
  .option("-t, --tags <tags...>", "List of tags to upload")
  .option("-v, --variables <variables...>", "List of variables to upload")
  .option("-m, --templates <templates...>", "List of templates to upload")
  .option("-a, --all <boolean>", "Upload all tags, variables and templates")
  .option("--test <boolean>", "run a test", true)
  .action((options) => {
    // TODO fix it so you can select which templates to upload
    if (options.all) {
      uploadChanges(true, true, true);
      return;
    }
    if (options.test) {
      uploadChanges(false, false, true);
      return;
    }
    console.log(options);
    uploadChanges(options.tags, options.variables, options.templates);
  });

program.parse();
