/**
 * Zustand Adapter Hook
 * 
 * This hook provides a unified interface for the Zustand store that matches
 * the CanvasStore interface. It will be used by components to interact with
 * Zustand in a way that's identical to the other state management solutions.
 */

import { useZustandStore } from '../store/zustandStore'
import type { CanvasStore } from '../store/types'

/**
 * Unified Zustand hook that provides the complete store interface
 * This matches the exact same API that will be provided by Redux and Context adapters
 */
export const useZustandState = (): CanvasStore => {
  // Use the entire store - Zustand 5.x handles updates efficiently by default
  return useZustandStore()
}

/**
 * Performance-optimized hooks for specific use cases
 * These hooks extract specific parts of the store to minimize re-renders
 */

// State-only hooks (for read-only components)
export const useZustandCanvasState = () => {
  return useZustandStore(state => ({
    shapes: state.shapes,
    currentColor: state.currentColor,
    currentTool: state.currentTool,
    isDrawing: state.isDrawing,
    currentPath: state.currentPath,
    history: state.history,
    historyIndex: state.historyIndex,
  }))
}

// Actions-only hook (for components that only trigger actions)
export const useZustandCanvasActions = () => {
  return useZustandStore(state => ({
    addShape: state.addShape,
    changeColor: state.changeColor,
    changeTool: state.changeTool,
    startDrawing: state.startDrawing,
    continueDrawing: state.continueDrawing,
    finishDrawing: state.finishDrawing,
    undo: state.undo,
    redo: state.redo,
    clear: state.clear,
    reset: state.reset
  }))
}

// History-specific hooks
export const useZustandHistory = () => {
  return useZustandStore(state => ({
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    undo: state.undo,
    redo: state.redo,
    historyIndex: state.historyIndex,
    historyLength: state.history.length
  }))
}

// Drawing-specific hooks
export const useZustandDrawing = () => {
  return useZustandStore(state => ({
    isDrawing: state.isDrawing,
    currentPath: state.currentPath,
    startDrawing: state.startDrawing,
    continueDrawing: state.continueDrawing,
    finishDrawing: state.finishDrawing,
  }))
}

// Tool management hooks
export const useZustandTools = () => {
  return useZustandStore(state => ({
    currentColor: state.currentColor,
    currentTool: state.currentTool,
    changeColor: state.changeColor,
    changeTool: state.changeTool,
  }))
}