import React, { useEffect, useRef, useMemo } from 'react';
import { GraphVisualizer } from '../dist/index.js';
import './ReactApp.css';

function ReactApp() {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const isInitializedRef = useRef(false);

  const theme = useRef(0);
  const colors = useMemo(() => ({
    0: ['#b1c8a7', '#c5dcb4', '#d9e7c4', '#e2f0d9', '#f0f7e0'],
    1: ['#a99fd5','#B098CD','#d1c6e7','#D7C9DE','#C4B0D5'],
  }), []);

  useEffect(() => {
    // 防止在React严格模式下的重复初始化
    if (isInitializedRef.current) {
      return;
    }

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

    // 创建图表实例
    graphRef.current = new GraphVisualizer(containerRef.current, {
      nodeStyle: {
        fill: (d) => {
          const color = colors[theme.current];
          if (d.layer === 1) return color[0];
          if (d.layer === 2) return color[1];
          if (d.layer === 3) {
            if (d.label.endsWith('A')) return color[2];
            if (d.label.endsWith('B')) return color[3];
            if (d.label.endsWith('C')) return color[4];
          };
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

    // 设置数据
    graphRef.current.setData(data);
    
    // 标记为已初始化
    isInitializedRef.current = true;

    // 清理函数
    return () => {
      if (graphRef.current) {
        try {
          graphRef.current.destroy();
        } catch (error) {
          console.warn('清理图表时发生错误:', error);
        } finally {
          graphRef.current = null;
          isInitializedRef.current = false;
        }
      }
    };
  }, [colors]);

  const handleReset = () => {
    if (graphRef.current) {
      try {
        graphRef.current.resetGraph();
      } catch (error) {
        console.error('重置图表时发生错误:', error);
      }
    } else {
      console.warn('图表实例不存在，无法重置');
    }
  };

  const handleUpdateTheme = () => {
    if (graphRef.current) {
      try {
        theme.current += 1;
        const color = colors[theme.current % 2];

        graphRef.current.updateOptions({
          nodeStyle: {
            fill: (d) => {
              if (d.layer === 1) return color[0];
              if (d.layer === 2) return color[1];
              if (d.layer === 3) {
                if (d.label.endsWith('A')) return color[2];
                if (d.label.endsWith('B')) return color[3];
                if (d.label.endsWith('C')) return color[4];
              };
              return color[0];
            },
          },
        });
      } catch (error) {
        console.error('更新主题时发生错误:', error);
      }
    }
  };

  return (
    <div className="ReactApp">
      <header className="ReactApp-header">
        <h1>Antv-Unfold 演示</h1>
        <p>基于 AntV G6 的可配置关系图可视化库，支持节点展开、自定义样式和丰富的交互功能</p>
        <div className="controls">
          <button onClick={handleReset} className="btn btn-primary">
            重置图表
          </button>
          <button onClick={handleUpdateTheme} className="btn btn-secondary">
            更新主题
          </button>
        </div>
      </header>
      
      <main className="ReactApp-main">
        <div 
          ref={containerRef}
          className="graph-container"
        />
      </main>
    </div>
  );
}

export default ReactApp;
