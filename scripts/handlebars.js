export const getHandlebarsVariables = (str) => {
  const regex = /\{\{([^}]+)\}\}/g;
  let match;
  const matches = [];

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
};

export const processHandlebarsVariables = (str, variables) => {
  let result = str;
  variables.forEach((variable) => {
    const regex = new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, "g");
    result = result.replace(regex, `"{{${variable}}}"`);
  });
  return result;
};

export const reverseProcessHandlebarsVariables = (str) => {
  let result = str;
  const regex = /"\{\{(.+?)\}\}"/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    const variable = match[1].trim();
    const replacement = `{{${variable}}}`;
    result = result.replace(match[0], replacement);
  }

  return result;
};
