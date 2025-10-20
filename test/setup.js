global.document = {
  createElement: () => ({
    style: {},
    appendChild: () => {},
    removeChild: () => {},
    clientWidth: 800,
    clientHeight: 600
  })
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {}
};
