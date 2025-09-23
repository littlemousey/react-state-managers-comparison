/**
 * Universal Canvas Store Hooks
 * 
 * Contains all the hooks for the universal store interface
 */

import { useContext } from 'react'
import { useZustandState } from './useZustandState'
import { useReduxState } from './useReduxState'
import { useContextState } from './useContextState'
import type { StoreType, StoreAdapterRegistry } from './storeAdapter'
import { STORE_CONFIGS } from './storeAdapter'
import type { CanvasStore } from '../store/types'
import { StoreTypeContext } from './storeTypeContext'

// ============================================================================
// Store Registry
// ============================================================================

/**
 * Registry of all available store adapters
 */
const STORE_ADAPTERS: StoreAdapterRegistry = {
  zustand: useZustandState,
  redux: useReduxState,
  context: useContextState
}

// ============================================================================
// Store Type Hook
// ============================================================================

/**
 * Hook to get the current store type
 */
export const useStoreType = (): StoreType => {
  return useContext(StoreTypeContext)
}

// ============================================================================
// Universal Store Hook
// ============================================================================

/**
 * Universal canvas store hook that automatically uses the correct
 * store implementation based on the current context
 */
export const useCanvasStore = (): CanvasStore => {
  const storeType = useStoreType()
  const adapter = STORE_ADAPTERS[storeType]
  
  if (!adapter) {
    throw new Error(`Unknown store type: ${storeType}`)
  }
  
  return adapter()
}

// ============================================================================
// Typed Store Hooks
// ============================================================================

/**
 * Hook that ensures a specific store type is being used
 * Throws an error if the wrong store type is active
 */
export const useTypedCanvasStore = <T extends StoreType>(
  expectedType: T
): CanvasStore => {
  const currentType = useStoreType()
  
  if (currentType !== expectedType) {
    throw new Error(
      `Expected store type '${expectedType}' but got '${currentType}'`
    )
  }
  
  return useCanvasStore()
}

/**
 * Hook that provides the store along with its type information
 */
export const useCanvasStoreWithType = (): {
  store: CanvasStore
  storeType: StoreType
  config: import('./storeAdapter').StoreConfig
} => {
  const storeType = useStoreType()
  const store = useCanvasStore()
  
  return {
    store,
    storeType,
    config: STORE_CONFIGS[storeType]
  }
}

// ============================================================================
// Store Switching Utilities
// ============================================================================

/**
 * Hook that provides utilities for working with multiple store types
 */
export const useStoreUtils = () => {
  const currentType = useStoreType()
  
  return {
    currentStoreType: currentType,
    availableStoreTypes: Object.keys(STORE_ADAPTERS) as StoreType[],
    isStoreType: (type: StoreType) => currentType === type,
    getStoreConfig: (type: StoreType) => {
      return STORE_CONFIGS[type]
    }
  }
}

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Hook for debugging that shows which store is currently active
 */
export const useStoreDebugInfo = () => {
  const { store, storeType, config } = useCanvasStoreWithType()
  
  return {
    storeType,
    storeName: config.name,
    storeDescription: config.description,
    stateSnapshot: {
      shapesCount: store.shapes.length,
      currentColor: store.currentColor,
      currentTool: store.currentTool,
      isDrawing: store.isDrawing,
      historyLength: store.history.length,
      historyIndex: store.historyIndex
    }
  }
}