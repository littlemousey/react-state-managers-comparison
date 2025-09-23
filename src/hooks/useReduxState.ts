/**
 * Redux Adapter Hook
 * 
 * This hook provides a unified interface for the Redux store that matches
 * the CanvasStore interface. It will be used by components to interact with
 * Redux in a way that's identical to the other state management solutions.
 */

import { useCallback } from 'react'
import { useAppDispatch } from '../store/reduxHooks'
import {
  useReduxShapes,
  useReduxCurrentColor,
  useReduxCurrentTool,
  useReduxIsDrawing,
  useReduxCurrentPath,
  useReduxHistory as useReduxHistoryState,
  useReduxHistoryIndex,
  useReduxCanUndo,
  useReduxCanRedo
} from '../store/reduxHooks'
import {
  addShape as addShapeAction,
  changeColor as changeColorAction,
  changeTool as changeToolAction,
  startDrawing as startDrawingAction,
  continueDrawing as continueDrawingAction,
  finishDrawing as finishDrawingAction,
  undo as undoAction,
  redo as redoAction,
  clear as clearAction,
  reset as resetAction
} from '../store/reduxStore'
import type { CanvasStore, Point, DrawingTool } from '../store/types'

/**
 * Unified Redux hook that provides the complete store interface
 * This matches the exact same API that is provided by Zustand and Context adapters
 */
export const useReduxState = (): CanvasStore => {
  const dispatch = useAppDispatch()

  // Get state slices
  const shapes = useReduxShapes()
  const currentColor = useReduxCurrentColor()
  const currentTool = useReduxCurrentTool()
  const isDrawing = useReduxIsDrawing()
  const currentPath = useReduxCurrentPath()
  const history = useReduxHistoryState()
  const historyIndex = useReduxHistoryIndex()

  // Create action dispatchers
  const addShape = useCallback((shapeData: {
    points: Point[]
    color: string
    type: DrawingTool
  }) => {
    dispatch(addShapeAction(shapeData))
  }, [dispatch])

  const changeColor = useCallback((color: string) => {
    dispatch(changeColorAction(color))
  }, [dispatch])

  const changeTool = useCallback((tool: DrawingTool) => {
    dispatch(changeToolAction(tool))
  }, [dispatch])

  const startDrawing = useCallback((startPoint: Point) => {
    dispatch(startDrawingAction(startPoint))
  }, [dispatch])

  const continueDrawing = useCallback((point: Point) => {
    dispatch(continueDrawingAction(point))
  }, [dispatch])

  const finishDrawing = useCallback(() => {
    dispatch(finishDrawingAction())
  }, [dispatch])

  const undo = useCallback(() => {
    dispatch(undoAction())
  }, [dispatch])

  const redo = useCallback(() => {
    dispatch(redoAction())
  }, [dispatch])

  const clear = useCallback(() => {
    dispatch(clearAction())
  }, [dispatch])

  const reset = useCallback(() => {
    dispatch(resetAction())
  }, [dispatch])

  return {
    // State
    shapes,
    currentColor,
    currentTool,
    history,
    historyIndex,
    isDrawing,
    currentPath,
    
    // Actions
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
  }
}

/**
 * Performance-optimized hooks for specific use cases
 * Components can use these if they only need specific parts of the state
 */

// State-only hooks (for read-only components)
export const useReduxCanvasState = () => ({
  shapes: useReduxShapes(),
  currentColor: useReduxCurrentColor(),
  currentTool: useReduxCurrentTool(),
  isDrawing: useReduxIsDrawing(),
  currentPath: useReduxCurrentPath(),
  history: useReduxHistoryState(),
  historyIndex: useReduxHistoryIndex(),
})

// Actions-only hook (for components that only trigger actions)
export const useReduxCanvasActions = () => {
  const dispatch = useAppDispatch()

  return {
    addShape: useCallback((shapeData: Parameters<typeof addShapeAction>[0]) => {
      dispatch(addShapeAction(shapeData))
    }, [dispatch]),
    changeColor: useCallback((color: string) => {
      dispatch(changeColorAction(color))
    }, [dispatch]),
    changeTool: useCallback((tool: DrawingTool) => {
      dispatch(changeToolAction(tool))
    }, [dispatch]),
    startDrawing: useCallback((startPoint: Point) => {
      dispatch(startDrawingAction(startPoint))
    }, [dispatch]),
    continueDrawing: useCallback((point: Point) => {
      dispatch(continueDrawingAction(point))
    }, [dispatch]),
    finishDrawing: useCallback(() => {
      dispatch(finishDrawingAction())
    }, [dispatch]),
    undo: useCallback(() => {
      dispatch(undoAction())
    }, [dispatch]),
    redo: useCallback(() => {
      dispatch(redoAction())
    }, [dispatch]),
    clear: useCallback(() => {
      dispatch(clearAction())
    }, [dispatch]),
    reset: useCallback(() => {
      dispatch(resetAction())
    }, [dispatch])
  }
}

// History-specific hooks
export const useReduxHistoryActions = () => {
  const dispatch = useAppDispatch()
  
  return {
    canUndo: useReduxCanUndo(),
    canRedo: useReduxCanRedo(),
    undo: useCallback(() => {
      dispatch(undoAction())
    }, [dispatch]),
    redo: useCallback(() => {
      dispatch(redoAction())
    }, [dispatch])
  }
}

// Drawing-specific hooks
export const useReduxDrawing = () => {
  const dispatch = useAppDispatch()
  
  return {
    isDrawing: useReduxIsDrawing(),
    currentPath: useReduxCurrentPath(),
    startDrawing: useCallback((startPoint: Point) => {
      dispatch(startDrawingAction(startPoint))
    }, [dispatch]),
    continueDrawing: useCallback((point: Point) => {
      dispatch(continueDrawingAction(point))
    }, [dispatch]),
    finishDrawing: useCallback(() => {
      dispatch(finishDrawingAction())
    }, [dispatch])
  }
}

// Tool management hooks
export const useReduxTools = () => {
  const dispatch = useAppDispatch()
  
  return {
    currentColor: useReduxCurrentColor(),
    currentTool: useReduxCurrentTool(),
    changeColor: useCallback((color: string) => {
      dispatch(changeColorAction(color))
    }, [dispatch]),
    changeTool: useCallback((tool: DrawingTool) => {
      dispatch(changeToolAction(tool))
    }, [dispatch])
  }
}