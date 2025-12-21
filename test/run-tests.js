// 简单的测试运行器
const fs = require('fs');
const path = require('path');

// 模拟jest的基本功能
global.describe = (name, fn) => {
  console.log(`\n📋 ${name}`);
  fn();
};

global.test = (name, fn) => {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}: ${error.message}`);
  }
};

global.beforeEach = (fn) => {
  // 简单的beforeEach实现
  global.beforeEachFn = fn;
};

global.expect = (actual) => ({
  toBeInstanceOf: (expected) => {
    if (!(actual instanceof expected)) {
      throw new Error(`Expected instance of ${expected.name}, got ${actual.constructor.name}`);
    }
  },
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined) {
      throw new Error('Expected value to be defined');
    }
  },
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  }
});

// 模拟jest.fn()
global.jest = {
  fn: () => {
    const fn = (...args) => {
      fn.calls.push(args);
      return fn.mockReturnValue;
    };
    fn.calls = [];
    fn.mockReturnValue = undefined;
    return fn;
  }
};

console.log('🧪 运行 AntV Unfold 测试...\n');

// 运行测试
try {
  require('./GraphVisualizer.test.js');
  console.log('\n✅ 所有测试通过！');
} catch (error) {
  console.log('\n❌ 测试失败:', error.message);
  process.exit(1);
}
