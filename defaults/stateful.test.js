const component = (name) => `import * as React from "react";

import { shallow } from "enzyme";

import { ${name} } from "./";

describe("${name} tests", () => {
  it("renders <${name} /> tree", () => {
    const wrapper = shallow(<${name} />);
    const instance = wrapper.instance();
    
    expect(instance).toBeInstanceOf(${name});
  });
});
`;

module.exports = (name) => component(name);
