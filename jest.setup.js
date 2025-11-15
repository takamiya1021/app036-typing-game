// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// IndexedDB のモック（fake-indexeddb）
import 'fake-indexeddb/auto'

// structuredClone polyfill for Node.js < 17
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj))
}
