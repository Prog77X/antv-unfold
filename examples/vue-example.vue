<template>
  <div class="VueApp">
    <header class="VueApp-header">
      <h1>Antv-Unfold 演示</h1>
      <p>基于 AntV G6 的可配置关系图可视化库，支持节点展开、自定义样式和丰富的交互功能</p>
      <div class="controls">
        <button @click="resetGraph" class="btn btn-primary">
          重置图表
        </button>
        <button @click="updateTheme" class="btn btn-secondary">
          更新主题
        </button>
      </div>
    </header>
    
    <main class="VueApp-main">
      <div ref="container" class="graph-container"></div>
    </main>
  </div>
</template>

<script>
import { GraphVisualizer } from '../dist/index.js';

export default {
  name: 'VueApp',
  data() {
    return {
      graph: null,
      theme: 0,
      colors: {
        0: ['#b1c8a7', '#c5dcb4', '#d9e7c4', '#e2f0d9', '#f0f7e0'],
        1: ['#a99fd5','#B098CD','#d1c6e7','#D7C9DE','#C4B0D5'],
      }
    };
  },
  mounted() {
    this.initGraph();
  },
  beforeUnmount() {
    if (this.graph) {
      try {
        this.graph.destroy();
      } catch (error) {
        console.warn('清理图表时发生错误:', error);
      } finally {
        this.graph = null;
      }
    }
  },
  methods: {
    initGraph() {
      const data = {
        nodes: [
          { 
            id: 'L1_1', 
            layer: 1, 
            label: 'Leader A', 
            size: 36,
          },
          { 
            id: 'L2_1', 
            layer: 2, 
            label: 'Team A', 
            size: 30,
            children: {
              nodes: [
                { id: 'L3_1', layer: 3, label: 'Member A', size: 30 },
                { id: 'L3_2', layer: 3, label: 'Member B', size: 30 },
                { id: 'L3_3', layer: 3, label: 'Member C', size: 30 },
              ],
              edges: [
                { source: 'L2_1', target: 'L3_1' },
                { source: 'L2_1', target: 'L3_2' },
                { source: 'L2_1', target: 'L3_3' },
              ]
            }
          },
          { 
            id: 'L2_2', 
            layer: 2, 
            label: 'Team B',
            size: 30,
            children: {
              nodes: [
                { id: 'L3_4', layer: 3, label: 'Member A', size: 30 },
                { id: 'L3_5', layer: 3, label: 'Member B', size: 30 },
              ],
              edges: [
                { source: 'L2_2', target: 'L3_4' },
                { source: 'L2_2', target: 'L3_5' },
              ]
            }
          },
          { 
            id: 'L2_3', 
            layer: 2, 
            label: 'Team C', 
            size: 30,
            children: {
              nodes: [
                { id: 'L3_6', layer: 3, label: 'Member A', size: 30 },
                { id: 'L3_7', layer: 3, label: 'Member B', size: 30 },
                { id: 'L3_8', layer: 3, label: 'Member C', size: 30 },
              ],
              edges: [
                { source: 'L2_3', target: 'L3_6' },
                { source: 'L2_3', target: 'L3_7' },
                { source: 'L2_3', target: 'L3_8' },
              ]
            }
          }
        ],
        edges: [
          { source: 'L1_1', target: 'L2_1' },
          { source: 'L1_1', target: 'L2_2' },
          { source: 'L1_1', target: 'L2_3' },
        ]
      };

      this.graph = new GraphVisualizer(this.$refs.container, {
        nodeStyle: {
          fill: (d) => {
            const color = this.colors[this.theme];
            if (d.layer === 1) return color[0];
            if (d.layer === 2) return color[1];
            if (d.layer === 3) {
              if (d.label.endsWith('A')) return color[2];
              if (d.label.endsWith('B')) return color[3];
              if (d.label.endsWith('C')) return color[4];
            }
            return color[0];
          },
        },
        // 事件回调
        onNodeClick: (ev, node) => {
          console.log('节点被点击:', node.label);
        },
        onNodeExpand: (nodeId, children) => {
          console.log('节点展开:', nodeId, '子节点数量:', children.nodes.length);
        },
      });

      this.graph.setData(data);
    },
    resetGraph() {
      if (this.graph) {
        try {
          this.graph.resetGraph();
        } catch (error) {
          console.error('重置图表时发生错误:', error);
        }
      } else {
        console.warn('图表实例不存在，无法重置');
      }
    },
    updateTheme() {
      if (this.graph) {
        try {
          this.theme = (this.theme + 1) % 2;
          const color = this.colors[this.theme];

          this.graph.updateOptions({
            nodeStyle: {
              fill: (d) => {
                if (d.layer === 1) return color[0];
                if (d.layer === 2) return color[1];
                if (d.layer === 3) {
                  if (d.label.endsWith('A')) return color[2];
                  if (d.label.endsWith('B')) return color[3];
                  if (d.label.endsWith('C')) return color[4];
                }
                return color[0];
              },
            },
          });
        } catch (error) {
          console.error('更新主题时发生错误:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.VueApp {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.VueApp-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.VueApp-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  font-weight: 300;
}

.VueApp-header p {
  margin: 0 0 20px 0;
  opacity: 0.9;
  font-size: 1.1em;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.VueApp-main {
  flex: 1;
  padding: 20px;
  background: #f8f9fa;
}

.graph-container {
  width: 100%;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin: 0 auto;
  max-width: 1200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .VueApp-header h1 {
    font-size: 2em;
  }
  
  .VueApp-header p {
    font-size: 1em;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
  
  .graph-container {
    height: 500px;
  }
}

@media (max-width: 480px) {
  .VueApp-header {
    padding: 15px;
  }
  
  .VueApp-header h1 {
    font-size: 1.8em;
  }
  
  .VueApp-main {
    padding: 15px;
  }
  
  .graph-container {
    height: 400px;
  }
}
</style>
