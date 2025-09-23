/**
 * Store Manager Component
 * 
 * This component manages the state for store switching and provides the
 * appropriate providers for each state management solution.
 * It ensures that when switching stores, the state is properly preserved
 * or reset as needed.
 */

import React, { useState, useMemo } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore } from '../store/reduxStore'
import { CanvasProvider } from '../store/contextStore'
import { StoreTypeProvider } from '../hooks'
import type { StoreType } from '../hooks/storeAdapter'
import StoreSelector from './StoreSelector'
import './StoreManager.css'

// ============================================================================
// Store Provider Wrapper Components
// ============================================================================

interface ProviderWrapperProps {
  storeType: StoreType
  children: React.ReactNode
}

/**
 * Zustand Provider Wrapper
 * Zustand doesn't need a provider, but we wrap it for consistency
 */
const ZustandProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

/**
 * Redux Provider Wrapper
 * Provides Redux store to the component tree
 */
const ReduxProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={reduxStore}>
      {children}
    </ReduxProvider>
  )
}

/**
 * Context Provider Wrapper
 * Provides React Context to the component tree
 */
const ContextProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CanvasProvider>
      {children}
    </CanvasProvider>
  )
}

/**
 * Universal Provider that switches between store providers
 */
const UniversalProvider: React.FC<ProviderWrapperProps> = ({ storeType, children }) => {
  const ProviderComponent = useMemo(() => {
    switch (storeType) {
      case 'zustand':
        return ZustandProviderWrapper
      case 'redux':
        return ReduxProviderWrapper
      case 'context':
        return ContextProviderWrapper
      default:
        throw new Error(`Unknown store type: ${storeType}`)
    }
  }, [storeType])

  return (
    <ProviderComponent>
      <StoreTypeProvider storeType={storeType}>
        {children}
      </StoreTypeProvider>
    </ProviderComponent>
  )
}

// ============================================================================
// Store Manager Component
// ============================================================================

interface StoreManagerProps {
  children: React.ReactNode
  showSelector?: boolean
  defaultStore?: StoreType
  className?: string
}

const StoreManager: React.FC<StoreManagerProps> = ({
  children,
  showSelector = true,
  defaultStore = 'zustand',
  className = ''
}) => {
  const [currentStore, setCurrentStore] = useState<StoreType>(defaultStore)

  const handleStoreChange = (newStoreType: StoreType) => {
    if (newStoreType === currentStore) return
    
    // You could add confirmation dialog here if needed
    console.log(`Switching from ${currentStore} to ${newStoreType}`)
    
    setCurrentStore(newStoreType)
  }

  return (
    <div className={`store-manager ${className}`}>
      {showSelector && (
        <StoreSelector
          currentStore={currentStore}
          onStoreChange={handleStoreChange}
        />
      )}
      
      <UniversalProvider storeType={currentStore}>
        {children}
      </UniversalProvider>
    </div>
  )
}

export default StoreManager
export type { StoreManagerProps }