/**
 * Universal Canvas Store Provider
 * 
 * This file contains the provider component for store type selection.
 * All hooks are exported from useCanvasStoreHooks.ts to satisfy React Fast Refresh.
 */

import React from 'react'
import type { StoreType } from './storeAdapter'
import { StoreTypeContext } from './storeTypeContext'

/**
 * Provider component for store type selection
 */
interface StoreTypeProviderProps {
  storeType: StoreType
  children: React.ReactNode
}

export const StoreTypeProvider: React.FC<StoreTypeProviderProps> = ({ 
  storeType, 
  children 
}) => {
  return (
    <StoreTypeContext.Provider value={storeType}>
      {children}
    </StoreTypeContext.Provider>
  )
}