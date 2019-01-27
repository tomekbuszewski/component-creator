/**
 * Component bootstrapper
 */

enum QuestionTypes {
  text = "text",
  select = "select",
}

enum Arguments {
  name = "--name",
}

interface QuestionChoice {
  title: string;
  value: string | boolean;
  disabled?: boolean;
}

interface Question {
  type: QuestionTypes;
  name: string;
  initial?: string;
  message: string;
  choices?: QuestionChoice[];
  validate?: (value: string | number) => boolean | string;
}

interface Answer {
  isClass: boolean;
  name: string;
}

interface GetTemplates {
  files: string[];
  functions: {
    [func: string]: (name: string, isClass: boolean) => string;
  };
}

interface Config {
  defaults: string;
  extension: string;
  stateless: string;
  stateful: string;
}

const extractArgument = (argument: Arguments, arguments: string[] = process.argv): string => {
  const argumentPosition: number = arguments.indexOf(argument);

  if (argumentPosition >= 0) {
    return arguments[argumentPosition + 1];
  }

  return "";
};

const createFile = (name: string, content: string = ""): boolean => {
  const { stdout } = process;
  if (typeof name === "undefined") {
    stdout.write("Please pass the path!\r"); return false;
  }

  const { promises, writeFile } = require("fs");
  const { dirname } = require("path");

  promises.mkdir(dirname(name), { recursive: true }).then(() => {
    writeFile(name, content, (err: Error) => {
      if (err) {
        console.error(err);
        return false;
      }

      stdout.write("File(s) created!\r");
      return true;
    });
  });

  return true;
};

const getTemplates = (path: string): GetTemplates => {
  const { readdirSync } = require("fs");
  const { resolve } = require("path");

  const files: string[] = readdirSync(path);
  const functions = files.reduce((acc: { [k: string]: string }, file: string) => {
    const filePath: string = `./${path}/${file}`;
    return {
      ...acc,
      [file]: require(resolve(filePath)),
    };
  }, {});

  return {
    files,
    functions,
  };
};

const getConfig = (): Config => {
  const { resolve } = require("path");
  const packageConfig: { bootstrap?: Config } = require(resolve("./package.json")).bootstrap;
  const config = {
    defaults: "defaults",
    extension: "ts",
    stateful: "containers",
    stateless: "ui",
  };

  if (packageConfig) {
    return { ...config, ...packageConfig };
  }

  return config;
};

const generateFiles = (
  basePath: string, extension: string, templates: GetTemplates, name: string, isClass: boolean,
): void => {
  const { files: initialTemplatesFiles, functions: templatesFn } = templates;
  const templatesFiles: string[] = isClass
    ? initialTemplatesFiles.filter((file: string) => file.indexOf("stateful") === 0)
    : initialTemplatesFiles.filter((file: string) => file.indexOf("stateless") === 0);

  const realExtension: string = extension.indexOf(".") === 0
    ? extension
    : `.${extension}`;

  templatesFiles.forEach((file: string) => {
    const strippedName: string = file
      .replace(new RegExp(/stateless\.|stateful\./gm), "")
      .replace(".js", realExtension);
    const fileName: string = `${basePath}/${name}/${strippedName}`;

    createFile(fileName, templatesFn[file](name, isClass));
  });
};

const questions: Question[] = [
  {
    choices: [
      { title: "Stateless", value: false },
      { title: "Stateful", value: true },
    ],
    message: "Type of component",
    name: "isClass",
    type: QuestionTypes.select,
  },
  {
    initial: extractArgument(Arguments.name),
    message: "Name of the component",
    name: "name",
    type: QuestionTypes.text,
    validate: (value) => String(value).length > 0 ? true : "Please enter components name",
  },
];

(async () => {
  const prompts = require("prompts");

  const { name, isClass }: Answer = await prompts(questions);
  const { stateful, stateless, defaults, extension }: Config = getConfig();
  const basePath: string = isClass ? stateful : stateless;

  generateFiles(basePath, extension, getTemplates(defaults), name, isClass);
})();
