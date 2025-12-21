const { Graph, GraphEvent } = require('@antv/g6');

/**
 * 关系图可视化器类
 * 支持可配置的节点展开、布局和交互
 */
class GraphVisualizer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = this.mergeDefaultOptions(options);
    this.graph = null;
    this.isClick = false;
    this.data = null;
    this.isDestroyed = false;
    this.isInitializing = false;
    this.timeouts = new Set();
    
    this.init();
  }

  /**
   * 合并默认配置
   */
  mergeDefaultOptions(options) {
    const defaults = {
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
      },
      // 布局配置
      layout: {
        type: 'd3-force',
        link: {
          distance: (d) => {
            if (!d.source || !d.target) return 100;
            if (d.source?.layer === 1) return 120;
            return 100;
          },
          strength: (d) => {
            if (!d.source || !d.target) return 0.7;
            // if (d.source.style?.zIndex !== 0 || d.target.style?.zIndex !== 0) return 0;
            return 0.7;
          },
        },
        manyBody: {
          strength: (d) => {
            if (d?.layer === 1) return -60;
            return -30;
          },
        },
        collide: {
          radius: 40,
          strength: 0.8,
        },
        center: {
          strength: 0,
        },
        radial: {
          strength: (node) => {
            if (node?.layer === 1) return 0;
            if (node?.layer === 2) return 0.001;
            return 0.01;
          },
          radius: (node) => {
            if (node?.layer === 1) return 15;
            if (node?.layer === 2) return 210;
            return 360;
          },
          x: 0,
          y: 0,
        }
      },
      // 交互行为配置
      behaviors: [
        {
          type: 'drag-element-force',
          fixed: true,
        },
        {
          type: 'click-select',
          state: 'active',
        },
        'zoom-canvas'
      ],
      // 工具栏配置
      toolbar: {
        enabled: true,
        position: 'top-left',
        items: ['zoom-in', 'zoom-out', 'auto-fit', 'reset']
      },
      // 事件回调
      onNodeClick: null,
      onNodeExpand: null,
      onGraphReady: null,
      // 其他配置
      autoFit: true,
      enableNodeExpansion: true,
    };

    return this.deepMerge(defaults, options);
  }

  /**
   * 深度合并对象
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * 初始化图表
   */
  init() {
    // 防止重复初始化
    if (this.isInitializing || this.isDestroyed) {
      return;
    }

    // 检查容器是否存在
    if (!this.container) {
      console.warn('容器元素不存在，无法初始化图表');
      return;
    }

    this.isInitializing = true;

    // 如果已经存在图形实例，先销毁
    if (this.graph) {
      this.destroy();
    }

    const config = {
      container: this.container,
      node: {
        style: this.options.nodeStyle,
      },
      edge: {
        style: this.options.edgeStyle,
      },
      layout: this.options.layout,
      behaviors: this.options.behaviors,
    };

    // 添加工具栏插件
    if (this.options.toolbar.enabled) {
      config.plugins = [this.createToolbarPlugin()];
    }

    try {
      this.graph = new Graph(config);
      this.setupEventListeners();
    } catch (error) {
      console.error('初始化图表时发生错误:', error);
      this.graph = null;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * 创建工具栏插件
   */
  createToolbarPlugin() {
    return {
      type: 'toolbar',
      position: this.options.toolbar.position,
      onClick: (id) => {
        this.handleToolbarClick(id);
      },
      getItems: () => {
        return this.options.toolbar.items.map(item => ({
          id: item,
          value: item
        }));
      },
    };
  }

  /**
   * 处理工具栏点击事件
   */
  handleToolbarClick(id) {
    if (this.isDestroyed || !this.graph) {
      return;
    }

    try {
      switch (id) {
        case 'zoom-in':
          const currentZoomIn = this.graph.getZoom();
          const newZoomIn = Math.min(currentZoomIn * 1.2, 3);
          this.graph.zoomTo(newZoomIn, {
            duration: 300,
            easing: 'ease-in-out',
          });
          break;
        case 'zoom-out':
          const currentZoomOut = this.graph.getZoom();
          const newZoomOut = Math.max(currentZoomOut * 0.8, 0.5);
          this.graph.zoomTo(newZoomOut, {
            duration: 300,
            easing: 'ease-in-out',
          });
          break;
        case 'auto-fit':
          this.graph.fitCenter();
          break;
        case 'reset':
          this.resetGraph();
          break;
        default:
          console.warn('未知的工具栏操作:', id);
          break;
      }
    } catch (error) {
      console.warn('处理工具栏点击时发生错误:', error);
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    this.graph.on(GraphEvent.BEFORE_RENDER, () => {
      if (!this.isClick && this.options.autoFit && !this.isDestroyed) {
        try {
          this.graph?.fitCenter();
        } catch (error) {
          console.warn('自动适应中心时发生错误:', error);
        }
      }
    });

    if (this.options.enableNodeExpansion) {
      this.graph.on('node:click', (ev) => {
        this.handleNodeClick(ev);
      });
    }
  }

  /**
   * 处理节点点击事件
   */
  handleNodeClick(ev) {
    if (this.isDestroyed || !this.graph) {
      return;
    }

    this.isClick = true;
    const { target } = ev;

    try {
      // 检查节点是否已展开（使用自定义属性）
      if (this.graph.getNodeData(target.id).isExpanded) {
        this.isClick = false;
        return;
      }

      // 查找被点击节点的数据
      const getAllNodes = (nodeList) => {
        const nodes = [];
        
        const traverse = (node) => {
          nodes.push(node);
          if (node?.children?.nodes) {
            node.children.nodes.forEach(child => traverse(child));
          }
        };
        
        nodeList.forEach(node => traverse(node));
        return nodes;
      };
      
      const allNodes = getAllNodes(this.data.nodes);
      const clickedNode = allNodes.find(node => node.id === target.id);
      if (!clickedNode || !clickedNode.children) {
        this.isClick = false;
        return;
      }

      // 调用用户自定义的节点点击回调
      if (this.options.onNodeClick) {
        this.options.onNodeClick(ev, clickedNode);
      }

      // 展开子节点
      this.expandNode(target, clickedNode.children);

      // 调用节点展开回调
      if (this.options.onNodeExpand) {
        this.options.onNodeExpand(target.id, clickedNode.children);
      }

      const timeoutId = setTimeout(() => {
        if (!this.isDestroyed) {
          this.isClick = false;
        }
        this.timeouts.delete(timeoutId);
      }, 20);
      this.timeouts.add(timeoutId);
    } catch (error) {
      console.warn('处理节点点击时发生错误:', error);
      this.isClick = false;
    }
  }

  /**
   * 展开节点
   */
  expandNode(target, childrenData) {
    if (this.isDestroyed || !this.graph) {
      return;
    }

    try {
      const nodes = this.graph.getNodeData();
      const edges = this.graph.getEdgeData();
      const newNodeModels = childrenData.nodes;
      const newEdgeModels = childrenData.edges;

      let newNodes = [];
      // 添加新节点
      newNodeModels.forEach((nodeModel, index) => {
        const exists = nodes.some(n => n.id === nodeModel.id);
        if (!exists) {
          newNodes.push({
            ...nodeModel,
            style: {
              x: target.style.x + 10 * index,
              y: target.style.y + 10 * index + 50,
            },
          });
        }
      });

      let newEdges = [];
      // 添加新边
      newEdgeModels.forEach(em => {
        const exists = edges.some(e => {
          return e.source === em.source && e.target === em.target;
        });
        if (!exists) {
          newEdges.push(em);
        }
      });

      // 标记父节点为已展开
      const updatedNodes = nodes.map(node => {
        if (node.id === target.id) {
          return { ...node, isExpanded: true };
        }
        return node;
      });

      this.graph.clear();
      this.graph.setData((prev) => ({
        ...prev,
        nodes: [...updatedNodes, ...newNodes],
        edges: [...edges, ...newEdges],
      }));
      this.graph.stopLayout();
      this.graph.render();
    } catch (error) {
      console.warn('展开节点时发生错误:', error);
    }
  }

  /**
   * 设置数据
   */
  setData(data) {
    if (this.isDestroyed || !this.graph) {
      console.warn('图形实例已销毁或不存在，无法设置数据');
      return;
    }

    try {
      this.data = data;
      this.graph.setData(data);
      
      // 使用setTimeout确保渲染在下一个事件循环中执行
      const renderTimeout = setTimeout(() => {
        if (!this.isDestroyed && this.graph) {
          try {
            this.graph.render();
            
            if (this.options.onGraphReady) {
              this.options.onGraphReady(this.graph);
            }
          } catch (error) {
            console.warn('渲染图形时发生错误:', error);
          }
        }
        this.timeouts.delete(renderTimeout);
      }, 0);
      this.timeouts.add(renderTimeout);
    } catch (error) {
      console.error('设置数据时发生错误:', error);
    }
  }

  /**
   * 重置图表
   */
  resetGraph() {
    if (this.isDestroyed || !this.graph || !this.data) {
      return;
    }

    try {
      // 清除所有节点的展开状态
      const resetData = {
        ...this.data,
        nodes: this.data.nodes.map(node => {
          const { isExpanded, ...nodeWithoutExpanded } = node;
          return nodeWithoutExpanded;
        })
      };

      this.graph.clear();
      this.graph.setData(resetData);
      this.graph.stopLayout();
      this.graph.render();
      this.graph.fitCenter();
    } catch (error) {
      console.warn('重置图表时发生错误:', error);
    }
  }

  /**
   * 获取图表实例
   */
  getGraph() {
    return this.graph;
  }

  /**
   * 销毁图表
   */
  destroy() {
    this.isDestroyed = true;
    this.isInitializing = false;
    
    // 清理所有定时器
    this.timeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.timeouts.clear();
    
    if (this.graph) {
      try {
        this.graph.destroy();
      } catch (error) {
        console.warn('销毁图表时发生错误:', error);
      } finally {
        this.graph = null;
      }
    }
  }

  /**
   * 更新配置
   */
  updateOptions(newOptions) {
    if (this.isDestroyed || this.isInitializing) {
      return;
    }

    this.options = this.deepMerge(this.options, newOptions);
    // 重新初始化图表
    this.destroy();
    this.isDestroyed = false; // 重置销毁状态
    this.isInitializing = false; // 重置初始化状态
    this.init();
    if (this.data) {
      this.setData(this.data);
    }
  }
}

module.exports = { GraphVisualizer };
