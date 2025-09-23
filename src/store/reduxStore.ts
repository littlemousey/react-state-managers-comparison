/**
 * Redux Toolkit Store Implementation
 * 
 * This implements the canvas drawing state using Redux Toolkit, which provides
 * a modern, opinionated approach to Redux with less boilerplate and built-in
 * best practices including Immer for immutable updates.
 * 
 * Key Redux Toolkit characteristics demonstrated here:
 * - createSlice for combined actions and reducers
 * - configureStore with automatic middleware setup
 * - Built-in Immer integration
 * - TypeScript support with proper typing
 * - Redux DevTools integration
 * - Structured approach with clear action creators
 */

import { createSlice, configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CanvasState, Point, DrawingTool } from './types'
import { initialCanvasState } from './types'
import { 
  createShape,
  addToHistory,
  canUndo,
  canRedo
} from './utils'

// ============================================================================
// Canvas Slice Definition
// ============================================================================

/**
 * Main canvas slice containing all state and actions
 * Redux Toolkit's createSlice automatically generates action creators and action types
 */
const canvasSlice = createSlice({
  name: 'canvas',
  initialState: initialCanvasState,
  reducers: {
    // ========================================================================
    // Shape Management Actions
    // ========================================================================
    
    addShape: (state, action: PayloadAction<{
      points: Point[]
      color: string
      type: DrawingTool
    }>) => {
      // Create the new shape with unique ID and timestamp
      const newShape = createShape(
        action.payload.points,
        action.payload.color,
        action.payload.type
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
    },

    // ========================================================================
    // Drawing Tool Actions
    // ========================================================================
    
    changeColor: (state, action: PayloadAction<string>) => {
      state.currentColor = action.payload
    },

    changeTool: (state, action: PayloadAction<DrawingTool>) => {
      state.currentTool = action.payload
    },

    // ========================================================================
    // Drawing State Actions
    // ========================================================================
    
    startDrawing: (state, action: PayloadAction<Point>) => {
      state.isDrawing = true
      state.currentPath = [action.payload]
    },

    continueDrawing: (state, action: PayloadAction<Point>) => {
      if (state.isDrawing) {
        state.currentPath.push(action.payload)
      }
    },

    finishDrawing: (state) => {
      if (state.isDrawing && state.currentPath.length > 0) {
        // Create shape from current path
        const newShape = createShape(
          state.currentPath,
          state.currentColor,
          state.currentTool
        )
        
        // Add shape to canvas
        state.shapes.push(newShape)
        
        // Reset drawing state
        state.isDrawing = false
        state.currentPath = []
        
        // Add to history
        const { history, historyIndex } = addToHistory(
          state.history,
          state.historyIndex,
          state.shapes
        )
        state.history = history
        state.historyIndex = historyIndex
      } else {
        // Just stop drawing if no path
        state.isDrawing = false
        state.currentPath = []
      }
    },

    // ========================================================================
    // History Actions (Undo/Redo)
    // ========================================================================
    
    undo: (state) => {
      if (canUndo(state.historyIndex)) {
        state.historyIndex -= 1
        // Restore shapes from history
        state.shapes = [...state.history[state.historyIndex]]
        
        // Stop any current drawing
        state.isDrawing = false
        state.currentPath = []
      }
    },

    redo: (state) => {
      if (canRedo(state.historyIndex, state.history.length)) {
        state.historyIndex += 1
        // Restore shapes from history
        state.shapes = [...state.history[state.historyIndex]]
        
        // Stop any current drawing
        state.isDrawing = false
        state.currentPath = []
      }
    },

    // ========================================================================
    // Canvas Management Actions
    // ========================================================================
    
    clear: (state) => {
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
    },

    reset: () => {
      // Return to initial state
      return { ...initialCanvasState }
    }
  }
})

// ============================================================================
// Export Action Creators
// ============================================================================

export const {
  addShape,
  changeColor,
  changeTool,
  startDrawing,
  continueDrawing,
  finishDrawing,
  undo,
  redo,
  clear,
  reset
} = canvasSlice.actions

// ============================================================================
// Store Configuration
// ============================================================================

/**
 * Configure the Redux store with Redux Toolkit's recommended settings
 * Includes automatic middleware setup and Redux DevTools integration
 */
export const reduxStore = configureStore({
  reducer: {
    canvas: canvasSlice.reducer
  },
  // Redux Toolkit includes helpful middleware by default:
  // - redux-thunk for async logic
  // - Immutability check middleware (development only)
  // - Serializability check middleware (development only)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serialization checks
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
})

// ============================================================================
// TypeScript Types for Store
// ============================================================================

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself
 */
export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

// ============================================================================
// Selector Helpers
// ============================================================================

/**
 * Pre-defined selectors for common state access patterns
 * These help with performance and type safety
 */
export const selectCanvasState = (state: RootState): CanvasState => state.canvas
export const selectShapes = (state: RootState) => state.canvas.shapes
export const selectCurrentColor = (state: RootState) => state.canvas.currentColor
export const selectCurrentTool = (state: RootState) => state.canvas.currentTool
export const selectIsDrawing = (state: RootState) => state.canvas.isDrawing
export const selectCurrentPath = (state: RootState) => state.canvas.currentPath
export const selectHistory = (state: RootState) => state.canvas.history
export const selectHistoryIndex = (state: RootState) => state.canvas.historyIndex

// Computed selectors
export const selectCanUndo = (state: RootState) => canUndo(state.canvas.historyIndex)
export const selectCanRedo = (state: RootState) => canRedo(state.canvas.historyIndex, state.canvas.history.length)

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Helper function to get current state snapshot (useful for debugging)
 */
export const getReduxSnapshot = (): CanvasState => {
  return reduxStore.getState().canvas
}

// Export the store for use in providers
export default reduxStore