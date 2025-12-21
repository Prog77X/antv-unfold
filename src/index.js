import { GraphVisualizer } from './GraphVisualizer.js';

// ES6 模块导出
export { GraphVisualizer };
export default GraphVisualizer;

// CommonJS 兼容性
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GraphVisualizer;
  module.exports.GraphVisualizer = GraphVisualizer;
}
