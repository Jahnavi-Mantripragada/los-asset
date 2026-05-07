export function renderTemplate(template, variables = {}) {
  if (!template) {
    throw new Error("Template is required");
  }

  return {
    subject: replaceVariables(template.subject || "", variables),
    bodyHtml: replaceVariables(template.bodyHtml || "", variables)
  };
}

export function replaceVariables(content = "", variables = {}) {
  return String(content).replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = getNestedValue(variables, key);
    return value !== undefined && value !== null ? String(value) : "";
  });
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[part];
  }, obj);
}