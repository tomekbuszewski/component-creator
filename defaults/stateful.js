const { userInfo } = require("os");
const date = new Date();

const component = (name) => `/**
 * @author ${userInfo().username}
 * @since ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
 */

import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

class ${name} extends React.Component<Props> {
  public render(): React.React.Node {
    return (
      <div>Hello</div>
    );
  }
}

export { ${name} };
`;

module.exports = (name) => component(name);
