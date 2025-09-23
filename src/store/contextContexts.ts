/**
 * React Context API - Canvas Contexts
 * 
 * Separate file for contexts to satisfy React Fast Refresh requirements.
 */

import { createContext } from 'react'
import type { CanvasState, CanvasActions } from './types'

// ============================================================================
// React Contexts
// ============================================================================

/**
 * Context for canvas state (read-only data)
 */
export const CanvasStateContext = createContext<CanvasState | undefined>(undefined)

/**
 * Context for canvas actions (functions)
 */
export const CanvasActionsContext = createContext<CanvasActions | undefined>(undefined)