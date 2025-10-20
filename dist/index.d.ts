/**
 * 节点数据接口
 */
export interface NodeData {
  id: string;
  label: string;
  layer?: number;
  size?: number;
  color?: string;
  children?: {
    nodes: NodeData[];
    edges: EdgeData[];
  };
  style?: {
    x?: number;
    y?: number;
    fixed?: boolean;
    zIndex?: number;
  };
  [key: string]: any;
}

/**
 * 边数据接口
 */
export interface EdgeData {
  source: string;
  target: string;
  [key: string]: any;
}

/**
 * 图表数据接口
 */
export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

/**
 * 节点样式配置接口
 */
export interface NodeStyleConfig {
  size?: (d: NodeData) => number;
  fill?: (d: NodeData) => string;
  labelText?: (d: NodeData) => string;
  labelPlacement?: string;
  labelFill?: string;
  [key: string]: any;
}

/**
 * 边样式配置接口
 */
export interface EdgeStyleConfig {
  stroke?: string;
  [key: string]: any;
}

/**
 * 布局配置接口
 */
export interface LayoutConfig {
  type: string;
  link?: {
    distance?: (d: any) => number;
    strength?: (d: any) => number;
  };
  manyBody?: {
    strength?: (d: any) => number;
  };
  collide?: {
    radius?: number;
    strength?: number;
  };
  center?: {
    strength?: number;
  };
  radial?: {
    strength?: (node: NodeData) => number;
    radius?: (node: NodeData) => number;
    x?: number;
    y?: number;
  };
  [key: string]: any;
}

/**
 * 行为配置接口
 */
export interface BehaviorConfig {
  type: string;
  fixed?: boolean;
  state?: string;
  [key: string]: any;
}

/**
 * 工具栏配置接口
 */
export interface ToolbarConfig {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  items: string[];
}

/**
 * 事件回调接口
 */
export interface EventCallbacks {
  onNodeClick?: (ev: any, node: NodeData) => void;
  onNodeExpand?: (nodeId: string, children: { nodes: NodeData[]; edges: EdgeData[] }) => void;
  onGraphReady?: (graph: any) => void;
}

/**
 * 图表可视化器配置接口
 */
export interface GraphVisualizerOptions {
  nodeStyle?: NodeStyleConfig;
  edgeStyle?: EdgeStyleConfig;
  layout?: LayoutConfig;
  behaviors?: (BehaviorConfig | string)[];
  toolbar?: ToolbarConfig;
  autoFit?: boolean;
  enableNodeExpansion?: boolean;
  onNodeClick?: (ev: any, node: NodeData) => void;
  onNodeExpand?: (nodeId: string, children: { nodes: NodeData[]; edges: EdgeData[] }) => void;
  onGraphReady?: (graph: any) => void;
}

/**
 * 图表可视化器类接口
 */
export interface IGraphVisualizer {
  constructor(container: string | HTMLElement, options?: GraphVisualizerOptions);
  setData(data: GraphData): void;
  getGraph(): any;
  destroy(): void;
  updateOptions(newOptions: Partial<GraphVisualizerOptions>): void;
  resetGraph(): void;
}

/**
 * 关系图可视化器类
 * 支持可配置的节点展开、布局和交互
 */
export declare class GraphVisualizer {
  constructor(container: string | HTMLElement, options?: GraphVisualizerOptions);
  setData(data: GraphData): void;
  getGraph(): any;
  destroy(): void;
  updateOptions(newOptions: Partial<GraphVisualizerOptions>): void;
  resetGraph(): void;
}

export default GraphVisualizer;
