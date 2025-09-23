/**
 * Store Adapter Interface
 * 
 * This file provides a unified interface for switching between different
 * state management implementations. Components can use these adapters
 * to remain agnostic about which store implementation is active.
 */

import type { CanvasStore } from '../store/types'

// ============================================================================
// Store Type Definitions
// ============================================================================

/**
 * Available store implementations
 */
export type StoreType = 'zustand' | 'redux' | 'context'

/**
 * Store adapter configuration
 */
export interface StoreConfig {
  type: StoreType
  name: string
  description: string
  features: string[]
  pros: string[]
  cons: string[]
}

/**
 * Store configurations for comparison
 */
export const STORE_CONFIGS: Record<StoreType, StoreConfig> = {
  zustand: {
    type: 'zustand',
    name: 'Zustand',
    description: 'A small, fast and scalable bearbones state-management solution',
    features: [
      'No providers needed',
      'Direct mutations with Immer',
      'Selective subscriptions',
      'TypeScript friendly',
      'Minimal boilerplate'
    ],
    pros: [
      'Smallest bundle size',
      'Excellent performance',
      'Simple API',
      'No provider boilerplate',
      'Great developer experience'
    ],
    cons: [
      'Smaller ecosystem',
      'Less debugging tools',
      'Newer library (less battle-tested)'
    ]
  },
  redux: {
    type: 'redux',
    name: 'Redux Toolkit',
    description: 'The official, opinionated, batteries-included toolset for efficient Redux development',
    features: [
      'createSlice with automatic actions',
      'Excellent DevTools',
      'Immutable updates with Immer',
      'Predictable state management',
      'Large ecosystem'
    ],
    pros: [
      'Excellent debugging tools',
      'Predictable state flow',
      'Large ecosystem',
      'Battle-tested',
      'Great for complex apps'
    ],
    cons: [
      'More boilerplate',
      'Steeper learning curve',
      'Provider requirement',
      'Larger bundle size'
    ]
  },
  context: {
    type: 'context',
    name: 'React Context',
    description: 'Built-in React state management using Context API and useReducer',
    features: [
      'Built into React',
      'No external dependencies',
      'Provider pattern',
      'useReducer for complex state',
      'React lifecycle integration'
    ],
    pros: [
      'No external dependencies',
      'Built into React',
      'Familiar to React developers',
      'Good for small to medium apps',
      'Zero bundle size overhead'
    ],
    cons: [
      'Performance limitations',
      'No built-in optimizations',
      'Provider requirement',
      'Limited debugging tools',
      'Manual optimization needed'
    ]
  }
}

// ============================================================================
// Store Adapter Type
// ============================================================================

/**
 * Generic store adapter interface
 * All store adapters must implement this interface
 */
export interface StoreAdapter {
  (): CanvasStore
}

// ============================================================================
// Store Adapter Registry
// ============================================================================

/**
 * Registry of available store adapters
 * This allows for dynamic switching between store implementations
 */
export interface StoreAdapterRegistry {
  zustand: StoreAdapter
  redux: StoreAdapter
  context: StoreAdapter
}

/**
 * Creates a store adapter registry with the provided adapters
 */
export const createStoreAdapterRegistry = (adapters: StoreAdapterRegistry): StoreAdapterRegistry => {
  return adapters
}

// ============================================================================
// Universal Store Hook
// ============================================================================

/**
 * Universal hook factory that creates a store hook for a specific implementation
 */
export const createStoreHook = (adapter: StoreAdapter) => {
  return adapter
}

/**
 * Conditional store hook that switches between implementations based on a condition
 */
export const createConditionalStoreHook = (
  condition: () => StoreType,
  adapters: StoreAdapterRegistry
): StoreAdapter => {
  return () => {
    const storeType = condition()
    return adapters[storeType]()
  }
}