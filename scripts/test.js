import processTags from "./processTags.js";
import processVariables from "./processVariables.js";
import processTemplates from "./processTemplates.js";

// Get the directory and type from the command-line arguments
// Get the third command
const [, , type] = process.argv;
let directory;
let processFunction;

switch (type) {
  case "tags":
    directory =
      "/Users/christoph/Code/christoph88/google-tagmanager-gh-deploy/workspaces/4-Workspace for testing/tags";
    processFunction = processTags;
    break;
  case "variables":
    directory =
      "/Users/christoph/Code/christoph88/google-tagmanager-gh-deploy/workspaces/4-Workspace for testing/variables";
    processFunction = processVariables;
    break;
  case "templates":
    directory =
      "/Users/christoph/Code/christoph88/google-tagmanager-gh-deploy/workspaces/4-Workspace for testing/templates";
    processFunction = processTemplates;
    break;
  default:
    console.log(
      'Invalid type. Please select either "tags", "variables", or "templates".'
    );
    process.exit(1);
}

// Call the function with the directory
processFunction(directory);
