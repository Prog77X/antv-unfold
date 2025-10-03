# AntV Unfold

一个基于 AntV G6 的可配置关系图可视化库，支持节点展开、自定义样式和丰富的交互功能。

## 特性

- 🎨 **高度可配置** - 支持自定义节点样式、边样式、布局算法
- 🔄 **节点展开** - 支持点击节点动态展开子节点
- 🛠️ **工具栏** - 内置缩放、自适应、重置等工具
- 📱 **响应式** - 支持拖拽、缩放、选择等交互
- 🎯 **TypeScript** - 完整的类型定义支持
- 📦 **轻量级** - 基于 AntV G6，体积小巧

## 安装

```bash
npm install antv-unfold
```

## 快速开始

### 基础用法

```javascript
import { GraphVisualizer } from 'antv-unfold';

// 准备数据
const data = {
  nodes: [
    {
      id: 'node1',
      label: '节点1',
      size: 40,
      color: '#FF6B6B',
      children: {
        nodes: [
          { id: 'child1', label: '子节点1', size: 30 },
          { id: 'child2', label: '子节点2', size: 30 }
        ],
        edges: [
          { source: 'node1', target: 'child1' },
          { source: 'node1', target: 'child2' }
        ]
      }
    }
  ],
  edges: []
};

// 创建图表实例
const graph = new GraphVisualizer('container', {
  nodeStyle: {
    fill: (d) => d.color || '#FF6B6B',
    size: (d) => d.size || 30
  },
  onNodeClick: (ev, node) => {
    console.log('点击了节点:', node.label);
  }
});

// 设置数据
graph.setData(data);
```

### 高级配置

```javascript
const graph = new GraphVisualizer('container', {
  // 节点样式配置
  nodeStyle: {
    size: (d) => d.size || 30,
    fill: (d) => d.color || '#FF6B6B',
    labelText: (d) => d.label || '',
    labelPlacement: 'center',
    labelFill: '#333',
  },
  
  // 边样式配置
  edgeStyle: {
    stroke: '#aaa',
    strokeWidth: 2,
  },
  
  // 布局配置
  layout: {
    type: 'd3-force',
    link: {
      distance: 150,
      strength: 0.7,
    },
    manyBody: {
      strength: -30,
    },
  },
  
  // 工具栏配置
  toolbar: {
    enabled: true,
    position: 'top-left',
    items: ['zoom-in', 'zoom-out', 'auto-fit', 'reset']
  },
  
  // 事件回调
  onNodeClick: (ev, node) => {
    console.log('节点被点击:', node.label);
  },
  onNodeExpand: (nodeId, children) => {
    console.log('节点展开:', nodeId);
  },
  onGraphReady: (graph) => {
    console.log('图表初始化完成');
  },
  
  // 其他配置
  autoFit: true,
  enableNodeExpansion: true,
});
```

## API 文档

### GraphVisualizer

#### 构造函数

```javascript
new GraphVisualizer(container, options)
```

- `container`: string | HTMLElement - 容器元素ID或DOM元素
- `options`: GraphVisualizerOptions - 配置选项

#### 方法

##### setData(data)

设置图表数据

```javascript
graph.setData({
  nodes: [...],
  edges: [...]
});
```

##### getGraph()

获取底层 G6 图表实例

```javascript
const g6Graph = graph.getGraph();
```

##### updateOptions(newOptions)

更新配置选项

```javascript
graph.updateOptions({
  nodeStyle: {
    fill: '#newColor'
  }
});
```

##### resetGraph()

重置图表到初始状态

```javascript
graph.resetGraph();
```

##### destroy()

销毁图表实例

```javascript
graph.destroy();
```

### 配置选项

#### GraphVisualizerOptions

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| nodeStyle | NodeStyleConfig | - | 节点样式配置 |
| edgeStyle | EdgeStyleConfig | - | 边样式配置 |
| layout | LayoutConfig | - | 布局配置 |
| behaviors | (BehaviorConfig \| string)[] | - | 交互行为配置 |
| toolbar | ToolbarConfig | - | 工具栏配置 |
| autoFit | boolean | true | 是否自动适应画布 |
| enableNodeExpansion | boolean | true | 是否启用节点展开 |
| onNodeClick | function | - | 节点点击回调 |
| onNodeExpand | function | - | 节点展开回调 |
| onGraphReady | function | - | 图表就绪回调 |

## 数据格式

### 节点数据 (NodeData)

```typescript
interface NodeData {
  id: string;                    // 节点唯一标识
  label: string;                 // 节点标签
  layer?: number;                // 节点层级
  size?: number;                 // 节点大小
  color?: string;                // 节点颜色
  children?: {                   // 子节点数据
    nodes: NodeData[];
    edges: EdgeData[];
  };
  style?: {                      // 节点样式
    x?: number;
    y?: number;
    fixed?: boolean;
    zIndex?: number;
  };
}
```

### 边数据 (EdgeData)

```typescript
interface EdgeData {
  source: string;                // 源节点ID
  target: string;                // 目标节点ID
}
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建库

```bash
npm run build:lib
```

### 运行测试

```bash
npm test
```

## 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 致谢

- [AntV G6](https://g6.antv.vision/) - 强大的图可视化引擎
- 所有贡献者和用户的支持

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Prog77X/antv-unfold.git
cd antv-unfold

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 运行测试
npm test

# 构建项目
npm run build
```

### 问题反馈

如果您发现任何问题或有功能建议，请：

1. 查看 [Issues](https://github.com/Prog77X/antv-unfold/issues) 是否已有相关问题
2. 如果没有，请创建新的 Issue
3. 提供详细的错误描述和复现步骤

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循现有的代码风格
- 为新功能添加测试
- 更新相关文档

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础的关系图可视化
- 支持节点展开功能
- 支持自定义样式和布局
- 内置工具栏和交互功能