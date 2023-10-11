#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { downloadContainer } from "./scripts/downloadContainer.js";
import { buildChanges } from "./scripts/buildChanges.js";
import { uploadChanges } from "./scripts/uploadChanges.js";
import { Command } from "commander";
const program = new Command();

const verify = (message, cb) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(message + " y/n > ", (answer) => {
    if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
      cb();
    } else {
      console.log("Operation cancelled.");
    }
    rl.close();
  });
};

program.version("1.2.7").description("Tagmanager build tool");

program
  .command("fetch")
  .description("Fetch changes from Tagmanager without extracting code.")
  .action(() => {
    downloadContainer(false);
  });

program
  .command("pull")
  .description("Pull changes from Tagmanager and extract code.")
  .action(() => {
    downloadContainer(true);
  });

program
  .command("build")
  .description("Build json files so they are ready for upload.")
  .action(() => {
    buildChanges();
  });

program
  .command("push")
  .description(
    "Push changes to tagmanager. Include a comma seperated list of paths to process or omit to process all."
  )
  .option("-t, --tags [tags...]", "Build filename of tags to upload")
  .option(
    "-v, --variables [variables...]",
    "Build filename of variables to upload"
  )
  .option(
    "-tm, --templates [templates...]",
    "Build filename of templates to upload"
  )
  .option("-a, --all", "Upload all tags, variables and templates")
  .action((options) => {
    console.log(options);
    if (options.tags || options.variables || options.templates) {
      verify("Upload changes?\n" + JSON.stringify(options, null, 2), () => {
        uploadChanges(options.tags, options.variables, options.templates);
      });
      return;
    }
    if (options.all) {
      verify("Upload all changes?", () => {
        uploadChanges(true, true, true);
      });
      return;
    }
    console.error("At least one option is required");
    process.exit(1);
  });

program.parse();
