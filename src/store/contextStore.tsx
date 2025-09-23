/**
 * React Context API Store Implementation
 * 
 * This implements the canvas drawing state using React's built-in Context API
 * with useReducer for state management. This approach leverages React's native
 * state management capabilities without external dependencies.
 * 
 * Key React Context characteristics demonstrated here:
 * - Built-in to React (no external dependencies)
 * - Provider pattern for state sharing
 * - useReducer for complex state logic
 * - useContext for state access
 * - Manual optimization required for performance
 * - Direct integration with React lifecycle
 */

import React, { useReducer, useMemo } from 'react'
import type { CanvasState, CanvasActions, Point, DrawingTool } from './types'
import { initialCanvasState } from './types'
import { 
  createShape,
  addToHistory,
  canUndo,
  canRedo
} from './utils'

// ============================================================================
// Action Types Definition
// ============================================================================

/**
 * Action types for the canvas reducer
 * Following Redux-style action pattern for consistency
 */
type CanvasActionType =
  | { type: 'ADD_SHAPE'; payload: { points: Point[]; color: string; type: DrawingTool } }
  | { type: 'CHANGE_COLOR'; payload: string }
  | { type: 'CHANGE_TOOL'; payload: DrawingTool }
  | { type: 'START_DRAWING'; payload: Point }
  | { type: 'CONTINUE_DRAWING'; payload: Point }
  | { type: 'FINISH_DRAWING' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' }
  | { type: 'RESET' }

// ============================================================================
// Reducer Implementation
// ============================================================================

/**
 * Canvas reducer function that handles all state updates
 * Uses Immer-style logic but implemented manually for immutability
 */
const canvasReducer = (state: CanvasState, action: CanvasActionType): CanvasState => {
  switch (action.type) {
    // ========================================================================
    // Shape Management Actions
    // ========================================================================
    
    case 'ADD_SHAPE': {
      // Create the new shape with unique ID and timestamp
      const newShape = createShape(
        action.payload.points,
        action.payload.color,
        action.payload.type
      )
      
      // Add shape to the canvas
      const newShapes = [...state.shapes, newShape]
      
      // Add to history for undo/redo functionality
      const { history, historyIndex } = addToHistory(
        state.history,
        state.historyIndex,
        newShapes
      )
      
      return {
        ...state,
        shapes: newShapes,
        history,
        historyIndex
      }
    }

    // ========================================================================
    // Drawing Tool Actions
    // ========================================================================
    
    case 'CHANGE_COLOR': {
      return {
        ...state,
        currentColor: action.payload
      }
    }

    case 'CHANGE_TOOL': {
      return {
        ...state,
        currentTool: action.payload
      }
    }

    // ========================================================================
    // Drawing State Actions
    // ========================================================================
    
    case 'START_DRAWING': {
      return {
        ...state,
        isDrawing: true,
        currentPath: [action.payload]
      }
    }

    case 'CONTINUE_DRAWING': {
      if (!state.isDrawing) return state
      
      return {
        ...state,
        currentPath: [...state.currentPath, action.payload]
      }
    }

    case 'FINISH_DRAWING': {
      if (!state.isDrawing || state.currentPath.length === 0) {
        return {
          ...state,
          isDrawing: false,
          currentPath: []
        }
      }
      
      // Create shape from current path
      const newShape = createShape(
        state.currentPath,
        state.currentColor,
        state.currentTool
      )
      
      // Add shape to canvas
      const newShapes = [...state.shapes, newShape]
      
      // Add to history
      const { history, historyIndex } = addToHistory(
        state.history,
        state.historyIndex,
        newShapes
      )
      
      return {
        ...state,
        shapes: newShapes,
        history,
        historyIndex,
        isDrawing: false,
        currentPath: []
      }
    }

    // ========================================================================
    // History Actions (Undo/Redo)
    // ========================================================================
    
    case 'UNDO': {
      if (!canUndo(state.historyIndex)) return state
      
      const newHistoryIndex = state.historyIndex - 1
      
      return {
        ...state,
        historyIndex: newHistoryIndex,
        shapes: [...state.history[newHistoryIndex]],
        isDrawing: false,
        currentPath: []
      }
    }

    case 'REDO': {
      if (!canRedo(state.historyIndex, state.history.length)) return state
      
      const newHistoryIndex = state.historyIndex + 1
      
      return {
        ...state,
        historyIndex: newHistoryIndex,
        shapes: [...state.history[newHistoryIndex]],
        isDrawing: false,
        currentPath: []
      }
    }

    // ========================================================================
    // Canvas Management Actions
    // ========================================================================
    
    case 'CLEAR': {
      // Clear all shapes
      const newShapes: typeof state.shapes = []
      
      // Add to history
      const { history, historyIndex } = addToHistory(
        state.history,
        state.historyIndex,
        newShapes
      )
      
      return {
        ...state,
        shapes: newShapes,
        history,
        historyIndex,
        isDrawing: false,
        currentPath: []
      }
    }

    case 'RESET': {
      return { ...initialCanvasState }
    }

    default:
      return state
  }
}

// ============================================================================
// Context Creation
// ============================================================================

// Import contexts from separate file for Fast Refresh compatibility
import { CanvasStateContext, CanvasActionsContext } from './contextContexts'

// ============================================================================
// Provider Component
// ============================================================================

interface CanvasProviderProps {
  children: React.ReactNode
}

/**
 * Canvas Provider component that provides state and actions to child components
 * Uses useReducer for state management and splits state/actions into separate contexts
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState)

  // ========================================================================
  // Action Creators
  // ========================================================================
  
  const actions: CanvasActions = useMemo(() => ({
    addShape: (shapeData) => {
      dispatch({ type: 'ADD_SHAPE', payload: shapeData })
    },

    changeColor: (color) => {
      dispatch({ type: 'CHANGE_COLOR', payload: color })
    },

    changeTool: (tool) => {
      dispatch({ type: 'CHANGE_TOOL', payload: tool })
    },

    startDrawing: (startPoint) => {
      dispatch({ type: 'START_DRAWING', payload: startPoint })
    },

    continueDrawing: (point) => {
      dispatch({ type: 'CONTINUE_DRAWING', payload: point })
    },

    finishDrawing: () => {
      dispatch({ type: 'FINISH_DRAWING' })
    },

    undo: () => {
      dispatch({ type: 'UNDO' })
    },

    redo: () => {
      dispatch({ type: 'REDO' })
    },

    clear: () => {
      dispatch({ type: 'CLEAR' })
    },

    reset: () => {
      dispatch({ type: 'RESET' })
    }
  }), []) // Actions are stable, no dependencies

  return (
    <CanvasStateContext.Provider value={state}>
      <CanvasActionsContext.Provider value={actions}>
        {children}
      </CanvasActionsContext.Provider>
    </CanvasStateContext.Provider>
  )
}

// Hooks are exported from contextHooks.ts to satisfy React Fast Refresh requirements