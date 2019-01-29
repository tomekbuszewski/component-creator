# Component bootstrapper

## Description
Creating components in the early stage of project development tends to be a chore. Still making the same `index`, `index.test` and `index.stories` files over and over, just to create a simple button.

Component bootstrapper aims to help you with this. With a simple command it creates a component with your template (of the one predefined). So you can do what's important – talk with your colleagues about shit while still have something to commit at the end of the day. Protip: name the commit "scaffolding".

## Installation
**NPM package is coming**. I am releasing it with 1.0 version.

To install this as a dependency, use the following command:

```bash
§ npm install git+ssh://git@github.com:tomekbuszewski/component-creator.git --save-dev
```

This will install the package as `component-bootstrap`. Then you can just create an alias in your `package.json`, like so:

```json
{
  "scripts": {
    "cb": "component-bootstrap"
  }
}
```

And just run it.

It will ask you for two things – name and type. By default, stateless component will be a function with imported Styled Components, and stateful will be a class extending `React.Component`.

## Configuration
All the configuration is done by `package.json`. Just add a `bootstrap` section in there with some (or all) of those fields:

```js
{
  "defaults": "./config/default-templates", // path to your templates
  "extension": ".tsx", // what should be the extension of your files
  "stateless": "./src/ui", // where should stateless components be placed
  "stateful": "./src/containers" // where should stateful components be placed
}
```

Templates are literals with one variable – `name`. They can have own logic, own internal variables (for example, use `Date`) etc. As long as they return a valid string, it's all good. Example templates are in `defaults` directory.