/**
 * Hooks Module Exports
 * 
 * Centralized exports for all canvas store hooks and utilities.
 * This provides a clean API for consuming components.
 */

// ============================================================================
// Individual Store Hooks
// ============================================================================

export { useZustandState } from './useZustandState'
export { useReduxState } from './useReduxState'
export { useContextState } from './useContextState'

// ============================================================================
// Store Adapter Configuration
// ============================================================================

export type { 
  StoreType, 
  StoreConfig, 
  StoreAdapterRegistry 
} from './storeAdapter'

export { 
  STORE_CONFIGS
} from './storeAdapter'

// ============================================================================
// Universal Store Interface
// ============================================================================

export {
  useCanvasStore,
  useStoreType,
  useTypedCanvasStore,
  useCanvasStoreWithType,
  useStoreUtils,
  useStoreDebugInfo
} from './useCanvasStoreHooks'

// ============================================================================
// Store Provider
// ============================================================================

export { StoreTypeProvider } from './useCanvasStore'
export { StoreTypeContext } from './storeTypeContext'

// ============================================================================
// Re-export Types
// ============================================================================

export type { CanvasStore } from '../store/types'

// ============================================================================
// Convenience Re-exports (Detailed Hooks)
// ============================================================================

// Zustand specific hooks
export {
  useZustandCanvasState,
  useZustandCanvasActions,
  useZustandHistory,
  useZustandDrawing,
  useZustandTools
} from './useZustandState'

// Redux specific hooks  
export {
  useReduxCanvasState,
  useReduxCanvasActions,
  useReduxHistoryActions,
  useReduxDrawing,
  useReduxTools
} from './useReduxState'

// Context specific hooks
export {
  useContextCanvasState,
  useContextCanvasActions,
  useContextHistoryActions,
  useContextDrawing,
  useContextTools
} from './useContextState'