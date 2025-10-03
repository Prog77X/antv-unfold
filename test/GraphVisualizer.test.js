const { GraphVisualizer } = require('../dist/index.js');

describe('GraphVisualizer', () => {
  let mockContainer;
  
  beforeEach(() => {
    // 创建模拟的DOM容器
    mockContainer = {
      style: {},
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      clientWidth: 800,
      clientHeight: 600,
      getBoundingClientRect: () => ({ width: 800, height: 600 })
    };
  });

  test('应该能够创建GraphVisualizer实例', () => {
    const graph = new GraphVisualizer(mockContainer);
    expect(graph).toBeInstanceOf(GraphVisualizer);
    expect(graph.container).toBe(mockContainer);
  });

  test('应该使用默认配置', () => {
    const graph = new GraphVisualizer(mockContainer);
    expect(graph.options).toBeDefined();
    expect(graph.options.autoFit).toBe(true);
    expect(graph.options.enableNodeExpansion).toBe(true);
    expect(graph.options.toolbar.enabled).toBe(true);
  });

  test('应该接受自定义配置', () => {
    const customOptions = {
      autoFit: false,
      enableNodeExpansion: false,
      nodeStyle: {
        fill: '#FF0000'
      }
    };
    
    const graph = new GraphVisualizer(mockContainer, customOptions);
    expect(graph.options.autoFit).toBe(false);
    expect(graph.options.enableNodeExpansion).toBe(false);
    expect(graph.options.nodeStyle.fill).toBe('#FF0000');
  });

  test('应该能够设置数据', () => {
    const graph = new GraphVisualizer(mockContainer);
    const testData = {
      nodes: [
        { id: 'node1', label: 'Node 1', size: 30 }
      ],
      edges: []
    };
    
    // 由于没有真实的G6实例，这里主要测试方法存在性
    expect(typeof graph.setData).toBe('function');
  });

  test('应该能够获取图表实例', () => {
    const graph = new GraphVisualizer(mockContainer);
    expect(typeof graph.getGraph).toBe('function');
  });

  test('应该能够销毁图表', () => {
    const graph = new GraphVisualizer(mockContainer);
    expect(typeof graph.destroy).toBe('function');
    
    graph.destroy();
    expect(graph.isDestroyed).toBe(true);
  });

  test('应该能够重置图表', () => {
    const graph = new GraphVisualizer(mockContainer);
    expect(typeof graph.resetGraph).toBe('function');
  });

  test('应该能够更新配置', () => {
    const graph = new GraphVisualizer(mockContainer);
    const newOptions = {
      nodeStyle: {
        fill: '#00FF00'
      }
    };
    
    expect(typeof graph.updateOptions).toBe('function');
  });

  test('应该正确处理深度合并', () => {
    const graph = new GraphVisualizer(mockContainer);
    const options1 = {
      nodeStyle: {
        fill: '#FF0000',
        size: 30
      }
    };
    const options2 = {
      nodeStyle: {
        fill: '#00FF00'
      }
    };
    
    const merged = graph.deepMerge(options1, options2);
    expect(merged.nodeStyle.fill).toBe('#00FF00');
    expect(merged.nodeStyle.size).toBe(30);
  });
});
