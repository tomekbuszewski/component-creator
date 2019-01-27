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

const extractArgument = (argument: Arguments, arguments: string[]): string => {
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

const getTemplates = (path: string = "defaults"): GetTemplates => {
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

(async () => {
  /** Globals */
  const prompts = require("prompts");
  const { argv } = process;

  /** Question list */
  const componentName: string = extractArgument(Arguments.name, argv);
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
      initial: componentName,
      message: "Name of the component",
      name: "name",
      type: QuestionTypes.text,
      validate: (value) => String(value).length > 0 ? true : "Please enter components name",
    },
  ];

  const values: Answer = await prompts(questions);
  const templates: GetTemplates = getTemplates();

  const { name, isClass } = values;
  const { files: templatesFiles, functions: templatesFn } = templates;

  templatesFiles.forEach((file: string) => {
    const basePath: string = isClass ? "containers" : "ui";
    createFile(`${basePath}/${name}/${file}`, templatesFn[file](name, isClass));
  });
})();
