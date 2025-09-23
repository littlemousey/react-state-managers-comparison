/**
 * Store Type Context
 * 
 * Separate file for the context to satisfy React Fast Refresh requirements
 */

import { createContext } from 'react'
import type { StoreType } from './storeAdapter'

/**
 * Context for storing the currently active store type
 */
export const StoreTypeContext = createContext<StoreType>('zustand')