const component = name => `
export * from "./${name}";
`;

module.exports = name => component(name);
