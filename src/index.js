/**
 * Component bootstrapper
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var QuestionTypes;
(function (QuestionTypes) {
    QuestionTypes["text"] = "text";
    QuestionTypes["select"] = "select";
})(QuestionTypes || (QuestionTypes = {}));
var Arguments;
(function (Arguments) {
    Arguments["name"] = "--name";
})(Arguments || (Arguments = {}));
const fileExists = (file) => {
    const { existsSync } = require("fs");
    return existsSync(file);
};
const extractArgument = (argument, arguments = process.argv) => {
    const argumentPosition = arguments.indexOf(argument);
    if (argumentPosition >= 0) {
        return arguments[argumentPosition + 1];
    }
    return "";
};
const createFile = (name, content = "") => {
    const { stdout } = process;
    if (typeof name === "undefined") {
        throw new Error("Please pass the path!\r");
    }
    if (fileExists(name)) {
        throw new Error(`File "${name}" already exists!\r`);
    }
    const { promises, writeFile } = require("fs");
    const { dirname } = require("path");
    promises.mkdir(dirname(name), { recursive: true }).then(() => {
        writeFile(name, content, (err) => {
            if (err) {
                throw new Error(`Errors creating file: ${JSON.stringify(err)}`);
            }
            stdout.write("File(s) created!\r");
            return true;
        });
    });
    return true;
};
const getTemplates = (path) => {
    const { readdirSync } = require("fs");
    const { resolve } = require("path");
    const files = readdirSync(path);
    const functions = files.reduce((acc, file) => {
        const filePath = `./${path}/${file}`;
        return Object.assign({}, acc, { [file]: require(resolve(filePath)) });
    }, {});
    return {
        files,
        functions,
    };
};
const getConfig = () => {
    const { resolve } = require("path");
    const packageConfig = require(resolve("./package.json")).bootstrap;
    const config = {
        defaults: "defaults",
        extension: "ts",
        stateful: "containers",
        stateless: "ui",
    };
    if (packageConfig) {
        return Object.assign({}, config, packageConfig);
    }
    return config;
};
const generateFiles = (basePath, extension, templates, name, isClass) => {
    const { files: initialTemplatesFiles, functions: templatesFn } = templates;
    const templatesFiles = isClass
        ? initialTemplatesFiles.filter((file) => file.indexOf("stateful") === 0)
        : initialTemplatesFiles.filter((file) => file.indexOf("stateless") === 0);
    const realExtension = extension.indexOf(".") === 0
        ? extension
        : `.${extension}`;
    templatesFiles.forEach((file) => {
        const strippedName = file
            .replace(new RegExp(/stateless\.|stateful\./gm), "")
            .replace(".js", realExtension);
        const fileName = `${basePath}/${name}/${strippedName}`;
        createFile(fileName, templatesFn[file](name, isClass));
    });
};
const questions = [
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
(() => __awaiter(this, void 0, void 0, function* () {
    const prompts = require("prompts");
    const { name, isClass } = yield prompts(questions);
    const { stateful, stateless, defaults, extension } = getConfig();
    const basePath = isClass ? stateful : stateless;
    try {
        generateFiles(basePath, extension, getTemplates(defaults), name, isClass);
    }
    catch (e) {
        console.error(e);
    }
}))();
//# sourceMappingURL=index.js.map