/**
 * Store Module Exports
 * 
 * Centralizes all store-related exports for clean imports
 */

// Type definitions
export type {
  Point,
  DrawingTool,
  Shape,
  CanvasState,
  CanvasActions,
  CanvasStore,
  AvailableColor,
  ToolConfig
} from './types'

// Constants
export {
  initialCanvasState,
  AVAILABLE_COLORS,
  TOOL_CONFIGS
} from './types'

// Utility functions
export {
  generateShapeId,
  createShape,
  renderShape,
  renderAllShapes,
  renderCurrentPath,
  addToHistory,
  canUndo,
  canRedo,
  isValidHexColor,
  isPointInBounds,
  clampPointToBounds
} from './utils'

// Zustand store
export {
  useZustandStore,
  useZustandShapes,
  useZustandCurrentColor,
  useZustandCurrentTool,
  useZustandIsDrawing,
  useZustandCurrentPath,
  useZustandCanUndo,
  useZustandCanRedo,
  useZustandAddShape,
  useZustandChangeColor,
  useZustandChangeTool,
  useZustandStartDrawing,
  useZustandContinueDrawing,
  useZustandFinishDrawing,
  useZustandUndo,
  useZustandRedo,
  useZustandClear,
  useZustandReset,
  subscribeToZustandChanges,
  getZustandSnapshot
} from './zustandStore'

// Redux store
export {
  reduxStore,
  addShape,
  changeColor,
  changeTool,
  startDrawing,
  continueDrawing,
  finishDrawing,
  undo,
  redo,
  clear,
  reset,
  selectCanvasState,
  selectShapes,
  selectCurrentColor,
  selectCurrentTool,
  selectIsDrawing,
  selectCurrentPath,
  selectCanUndo,
  selectCanRedo,
  getReduxSnapshot
} from './reduxStore'

export type { RootState, AppDispatch } from './reduxStore'

export { ReduxProvider } from './ReduxProvider'

export {
  useAppDispatch,
  useAppSelector,
  useReduxShapes,
  useReduxCurrentColor,
  useReduxCurrentTool,
  useReduxIsDrawing,
  useReduxCurrentPath,
  useReduxCanUndo,
  useReduxCanRedo,
  useReduxCanvasState
} from './reduxHooks'

// Context store
export { CanvasProvider } from './contextStore'
export { 
  CanvasStateContext,
  CanvasActionsContext 
} from './contextContexts'

export {
  useCanvasState,
  useCanvasActions,
  useContextCanvas,
  useContextShapes,
  useContextCurrentColor,
  useContextCurrentTool,
  useContextIsDrawing,
  useContextCurrentPath,
  useContextHistory,
  useContextSnapshot
} from './contextHooks'