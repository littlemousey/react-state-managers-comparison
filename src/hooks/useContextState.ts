/**
 * Context Adapter Hook
 * 
 * This hook provides a unified interface for the Context store that matches
 * the CanvasStore interface. It will be used by components to interact with
 * Context in a way that's identical to the other state management solutions.
 */

import { useContextCanvas } from '../store/contextHooks'
import type { CanvasStore } from '../store/types'

/**
 * Unified Context hook that provides the complete store interface
 * This matches the exact same API that is provided by Zustand and Redux adapters
 */
export const useContextState = (): CanvasStore => {
  // The useContextCanvas hook already provides the complete interface
  return useContextCanvas()
}

/**
 * Performance-optimized hooks for specific use cases
 * Note: These don't provide the same optimization as Zustand/Redux
 * since React Context re-renders all consumers when any part of state changes
 */

import {
  useCanvasActions,
  useContextShapes,
  useContextCurrentColor,
  useContextCurrentTool,
  useContextIsDrawing,
  useContextCurrentPath,
  useContextHistory
} from '../store/contextHooks'

// State-only hooks (for read-only components)
export const useContextCanvasState = () => ({
  shapes: useContextShapes(),
  currentColor: useContextCurrentColor(),
  currentTool: useContextCurrentTool(),
  isDrawing: useContextIsDrawing(),
  currentPath: useContextCurrentPath(),
  history: useContextHistory().history,
  historyIndex: useContextHistory().historyIndex,
})

// Actions-only hook (for components that only trigger actions)
export const useContextCanvasActions = () => useCanvasActions()

// History-specific hooks
export const useContextHistoryActions = () => {
  const history = useContextHistory()
  const actions = useCanvasActions()
  
  return {
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo: actions.undo,
    redo: actions.redo,
  }
}

// Drawing-specific hooks
export const useContextDrawing = () => {
  const actions = useCanvasActions()
  
  return {
    isDrawing: useContextIsDrawing(),
    currentPath: useContextCurrentPath(),
    startDrawing: actions.startDrawing,
    continueDrawing: actions.continueDrawing,
    finishDrawing: actions.finishDrawing,
  }
}

// Tool management hooks
export const useContextTools = () => {
  const actions = useCanvasActions()
  
  return {
    currentColor: useContextCurrentColor(),
    currentTool: useContextCurrentTool(),
    changeColor: actions.changeColor,
    changeTool: actions.changeTool,
  }
}