/**
 * React Context Hooks
 * 
 * This file contains all the hooks for accessing the Canvas Context API store.
 * Separated from the provider component to satisfy React Fast Refresh requirements.
 */

import { useContext } from 'react'
import type { CanvasState, CanvasActions } from './types'
import { canUndo, canRedo } from './utils'

// Import contexts from separate file for Fast Refresh compatibility
import { CanvasStateContext, CanvasActionsContext } from './contextContexts'

// ============================================================================
// Core Hook Implementations
// ============================================================================

/**
 * Hook to access canvas state
 * Throws an error if used outside of CanvasProvider
 */
export const useCanvasState = (): CanvasState => {
  const context = useContext(CanvasStateContext)
  if (context === undefined) {
    throw new Error('useCanvasState must be used within a CanvasProvider')
  }
  return context
}

/**
 * Hook to access canvas actions
 * Throws an error if used outside of CanvasProvider
 */
export const useCanvasActions = (): CanvasActions => {
  const context = useContext(CanvasActionsContext)
  if (context === undefined) {
    throw new Error('useCanvasActions must be used within a CanvasProvider')
  }
  return context
}

/**
 * Combined hook that provides both state and actions
 * This matches the interface provided by Zustand and Redux adapters
 */
export const useContextCanvas = () => {
  const state = useCanvasState()
  const actions = useCanvasActions()
  
  return {
    ...state,
    ...actions
  }
}

// ============================================================================
// Optimized Selector Hooks
// ============================================================================

/**
 * Optimized hooks for specific parts of the state
 * Note: React Context doesn't have built-in selector optimization like Zustand/Redux,
 * so these hooks still cause re-renders when any part of state changes.
 */

export const useContextShapes = () => {
  const state = useCanvasState()
  return state.shapes
}

export const useContextCurrentColor = () => {
  const state = useCanvasState()
  return state.currentColor
}

export const useContextCurrentTool = () => {
  const state = useCanvasState()
  return state.currentTool
}

export const useContextIsDrawing = () => {
  const state = useCanvasState()
  return state.isDrawing
}

export const useContextCurrentPath = () => {
  const state = useCanvasState()
  return state.currentPath
}

export const useContextHistory = () => {
  const state = useCanvasState()
  return {
    history: state.history,
    historyIndex: state.historyIndex,
    canUndo: canUndo(state.historyIndex),
    canRedo: canRedo(state.historyIndex, state.history.length)
  }
}

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Hook to get current state snapshot (useful for debugging)
 */
export const useContextSnapshot = (): CanvasState => {
  return useCanvasState()
}