const { userInfo } = require("os");
const date = new Date();

const component = (name) => `/**
 * @author ${userInfo().username}
 * @since ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
 */

import * as React from "react";
import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
}

const ${name}Component = (props: Props): React.ReactNode => (
  <div>
    Hello
  </div>
);

const ${name} = styled(${name}Component)\`\`;

export { ${name} };
`;

module.exports = (name) => component(name);
