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
    // Adding the original handlebar variable as a comment before replacing it
    result = result.replace(regex, `/* {{${variable}}} */ "${variable}"`);
  });
  return result;
};
