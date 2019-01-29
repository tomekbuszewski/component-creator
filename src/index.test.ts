const creator = require("./");

describe("Component creator tests", () => {
  it("should parse passed arguments if there are any", () => {
    const { extractArgument } = creator;

    expect(extractArgument("--name", ["--name", "Test"])).toEqual("Test");
    expect(extractArgument("--none", ["--name", "Test"])).toEqual("");
  });

  it("should provide proper config", () => {
    const { getConfig } = creator;
    const { resolve } = require("path");

    const initialConfig = {
      defaults: resolve(__dirname, "..", "defaults"),
      extension: "ts",
      stateful: "containers",
      stateless: "ui",
    };

    const newConfig = {
      extension: "js",
    };

    expect(getConfig()).toMatchObject(initialConfig);
    expect(getConfig(newConfig)).toMatchObject({ ...initialConfig, ...newConfig });
  });
});
