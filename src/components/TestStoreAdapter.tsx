/**
 * Test Component for Universal Store Adapter
 * 
 * This component tests that all three store implementations work 
 * identically through the universal interface.
 */

import React from 'react'
import { StoreTypeProvider, useCanvasStore, useStoreDebugInfo } from '../hooks'
import type { StoreType } from '../hooks'

// ============================================================================
// Test Canvas Component
// ============================================================================

/**
 * Component that uses the universal store interface
 */
const TestCanvas: React.FC = () => {
  const canvasStore = useCanvasStore()
  const debugInfo = useStoreDebugInfo()
  
  const handleAddTestShape = () => {
    canvasStore.addShape({
      points: [
        { x: 10, y: 10 },
        { x: 50, y: 50 },
        { x: 90, y: 10 }
      ],
      color: canvasStore.currentColor,
      type: canvasStore.currentTool
    })
  }
  
  const handleChangeColor = () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#000000']
    const currentIndex = colors.indexOf(canvasStore.currentColor)
    const nextColor = colors[(currentIndex + 1) % colors.length]
    canvasStore.changeColor(nextColor)
  }
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h4>Store: {debugInfo.storeName}</h4>
      <p>{debugInfo.storeDescription}</p>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Current State:</strong>
        <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px' }}>
          {JSON.stringify(debugInfo.stateSnapshot, null, 2)}
        </pre>
      </div>
      
      <button 
        onClick={handleAddTestShape}
        style={{ marginRight: '10px' }}
      >
        Add Test Shape
      </button>
      
      <button 
        onClick={handleChangeColor}
        style={{ marginRight: '10px' }}
      >
        Change Color
      </button>
      
      <button 
        onClick={canvasStore.undo}
        disabled={canvasStore.historyIndex <= 0}
        style={{ marginRight: '10px' }}
      >
        Undo
      </button>
      
      <button 
        onClick={canvasStore.redo}
        disabled={canvasStore.historyIndex >= canvasStore.history.length - 1}
        style={{ marginRight: '10px' }}
      >
        Redo
      </button>
      
      <button 
        onClick={canvasStore.clear}
        style={{ marginRight: '10px' }}
      >
        Clear
      </button>
    </div>
  )
}

// ============================================================================
// Store Tester Component
// ============================================================================

/**
 * Component that tests all three store implementations
 */
const StoreAdapterTest: React.FC = () => {
  const storeTypes: StoreType[] = ['zustand', 'redux', 'context']
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Universal Store Adapter Test</h2>
      <p>Testing that all three store implementations work identically:</p>
      
      {storeTypes.map(storeType => (
        <StoreTypeProvider key={storeType} storeType={storeType}>
          <TestCanvas />
        </StoreTypeProvider>
      ))}
    </div>
  )
}

export default StoreAdapterTest