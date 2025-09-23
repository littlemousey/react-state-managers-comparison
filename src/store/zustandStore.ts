/**
 * Zustand Store Implementation
 * 
 * This implements the canvas drawing state using Zustand, a small, fast and 
 * scalable bearbones state-management solution. Zustand uses a simplified 
 * approach with direct mutations and automatic subscriptions.
 * 
 * Key Zustand characteristics demonstrated here:
 * - No providers needed
 * - Direct state mutations (handled by immer under the hood)
 * - Simple hook-based API
 * - TypeScript-friendly
 * - Minimal boilerplate
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { 
  CanvasState, 
  CanvasStore
} from './types'
import { 
  initialCanvasState
} from './types'
import { 
  createShape,
  addToHistory,
  canUndo,
  canRedo
} from './utils'

/**
 * Zustand store implementation with immer middleware for immutable updates
 * and subscribeWithSelector for advanced subscription capabilities.
 */
export const useZustandStore = create<CanvasStore>()(
  // Enable subscribeWithSelector for advanced subscriptions
  subscribeWithSelector(
    // Enable immer for immutable state updates with mutable syntax
    immer((set, get) => ({
      // ============================================================================
      // Initial State
      // ============================================================================
      ...initialCanvasState,

      // ============================================================================
      // Shape Management Actions
      // ============================================================================
      
      addShape: (shapeData) => {
        set((state) => {
          // Create the new shape with unique ID and timestamp
          const newShape = createShape(
            shapeData.points,
            shapeData.color,
            shapeData.type
          )
          
          // Add shape to the canvas
          state.shapes.push(newShape)
          
          // Add to history for undo/redo functionality
          const { history, historyIndex } = addToHistory(
            state.history,
            state.historyIndex,
            state.shapes
          )
          state.history = history
          state.historyIndex = historyIndex
        })
      },

      // ============================================================================
      // Drawing Tool Actions
      // ============================================================================
      
      changeColor: (color) => {
        set((state) => {
          state.currentColor = color
        })
      },

      changeTool: (tool) => {
        set((state) => {
          state.currentTool = tool
        })
      },

      // ============================================================================
      // Drawing State Actions
      // ============================================================================
      
      startDrawing: (startPoint) => {
        set((state) => {
          state.isDrawing = true
          state.currentPath = [startPoint]
        })
      },

      continueDrawing: (point) => {
        set((state) => {
          if (state.isDrawing) {
            state.currentPath.push(point)
          }
        })
      },

      finishDrawing: () => {
        const state = get()
        
        if (state.isDrawing && state.currentPath.length > 0) {
          // Create shape from current path
          const shapeData = {
            points: state.currentPath,
            color: state.currentColor,
            type: state.currentTool
          }
          
          // Add the shape and reset drawing state
          set((draft) => {
            // Create the new shape
            const newShape = createShape(
              shapeData.points,
              shapeData.color,
              shapeData.type
            )
            
            // Add shape to canvas
            draft.shapes.push(newShape)
            
            // Reset drawing state
            draft.isDrawing = false
            draft.currentPath = []
            
            // Add to history
            const { history, historyIndex } = addToHistory(
              draft.history,
              draft.historyIndex,
              draft.shapes
            )
            draft.history = history
            draft.historyIndex = historyIndex
          })
        } else {
          // Just stop drawing if no path
          set((state) => {
            state.isDrawing = false
            state.currentPath = []
          })
        }
      },

      // ============================================================================
      // History Actions (Undo/Redo)
      // ============================================================================
      
      undo: () => {
        set((state) => {
          if (canUndo(state.historyIndex)) {
            state.historyIndex -= 1
            // Restore shapes from history
            state.shapes = [...state.history[state.historyIndex]]
            
            // Stop any current drawing
            state.isDrawing = false
            state.currentPath = []
          }
        })
      },

      redo: () => {
        set((state) => {
          if (canRedo(state.historyIndex, state.history.length)) {
            state.historyIndex += 1
            // Restore shapes from history
            state.shapes = [...state.history[state.historyIndex]]
            
            // Stop any current drawing
            state.isDrawing = false
            state.currentPath = []
          }
        })
      },

      // ============================================================================
      // Canvas Management Actions
      // ============================================================================
      
      clear: () => {
        set((state) => {
          // Clear all shapes
          state.shapes = []
          
          // Add to history
          const { history, historyIndex } = addToHistory(
            state.history,
            state.historyIndex,
            state.shapes
          )
          state.history = history
          state.historyIndex = historyIndex
          
          // Stop any current drawing
          state.isDrawing = false
          state.currentPath = []
        })
      },

      reset: () => {
        set(() => ({
          ...initialCanvasState
        }))
      }
    }))
  )
)

// ============================================================================
// Selector Hooks for Optimized Subscriptions
// ============================================================================

/**
 * Optimized selectors for specific parts of the state
 * These prevent unnecessary re-renders by only subscribing to specific slices
 */

// Basic state selectors
export const useZustandShapes = () => useZustandStore(state => state.shapes)
export const useZustandCurrentColor = () => useZustandStore(state => state.currentColor)
export const useZustandCurrentTool = () => useZustandStore(state => state.currentTool)
export const useZustandIsDrawing = () => useZustandStore(state => state.isDrawing)
export const useZustandCurrentPath = () => useZustandStore(state => state.currentPath)

// History selectors
export const useZustandCanUndo = () => useZustandStore(state => canUndo(state.historyIndex))
export const useZustandCanRedo = () => useZustandStore(state => canRedo(state.historyIndex, state.history.length))

// Individual action selectors (stable function references)
export const useZustandAddShape = () => useZustandStore(state => state.addShape)
export const useZustandChangeColor = () => useZustandStore(state => state.changeColor)
export const useZustandChangeTool = () => useZustandStore(state => state.changeTool)
export const useZustandStartDrawing = () => useZustandStore(state => state.startDrawing)
export const useZustandContinueDrawing = () => useZustandStore(state => state.continueDrawing)
export const useZustandFinishDrawing = () => useZustandStore(state => state.finishDrawing)
export const useZustandUndo = () => useZustandStore(state => state.undo)
export const useZustandRedo = () => useZustandStore(state => state.redo)
export const useZustandClear = () => useZustandStore(state => state.clear)
export const useZustandReset = () => useZustandStore(state => state.reset)

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Subscribe to all state changes for debugging
 * This is useful during development to track state mutations
 */
export const subscribeToZustandChanges = (callback: (state: CanvasState) => void) => {
  return useZustandStore.subscribe(callback)
}

/**
 * Get current state snapshot (useful for debugging)
 */
export const getZustandSnapshot = (): CanvasState => {
  return useZustandStore.getState()
}

// ============================================================================
// Store Devtools Integration
// ============================================================================

// Enable Redux DevTools integration in development
if (import.meta.env.DEV) {
  // Add store to window for debugging
  interface WindowWithStore extends Window {
    __ZUSTAND_STORE__?: typeof useZustandStore
  }
  ;(window as WindowWithStore).__ZUSTAND_STORE__ = useZustandStore
}