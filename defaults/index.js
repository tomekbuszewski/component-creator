const component = (name, isClass) => `import * as React from "react";

Hello from ${name};
${isClass ? "Class" : "Stateless"}
`;

module.exports = (name, isClass) =>component(name, isClass);
