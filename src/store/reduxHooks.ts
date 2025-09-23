/**
 * Typed Redux Hooks
 * 
 * This file provides pre-typed versions of the React Redux hooks
 * for use throughout the application. This ensures type safety
 * and reduces boilerplate in components.
 */

import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './reduxStore'

// ============================================================================
// Typed Hook Definitions
// ============================================================================

/**
 * Use throughout your app instead of plain `useDispatch`
 * Provides proper typing for dispatch actions
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * Use throughout your app instead of plain `useSelector`
 * Provides proper typing for state selection
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ============================================================================
// Pre-configured Selectors
// ============================================================================

/**
 * Convenience hooks for commonly accessed state slices
 * These prevent the need to write selectors in every component
 */

import {
  selectCanvasState,
  selectShapes,
  selectCurrentColor,
  selectCurrentTool,
  selectIsDrawing,
  selectCurrentPath,
  selectHistory,
  selectHistoryIndex,
  selectCanUndo,
  selectCanRedo
} from './reduxStore'

// Individual state slice hooks
export const useReduxShapes = () => useAppSelector(selectShapes)
export const useReduxCurrentColor = () => useAppSelector(selectCurrentColor)
export const useReduxCurrentTool = () => useAppSelector(selectCurrentTool)
export const useReduxIsDrawing = () => useAppSelector(selectIsDrawing)
export const useReduxCurrentPath = () => useAppSelector(selectCurrentPath)
export const useReduxHistory = () => useAppSelector(selectHistory)
export const useReduxHistoryIndex = () => useAppSelector(selectHistoryIndex)

// Computed state hooks
export const useReduxCanUndo = () => useAppSelector(selectCanUndo)
export const useReduxCanRedo = () => useAppSelector(selectCanRedo)

// Complete state hook
export const useReduxCanvasState = () => useAppSelector(selectCanvasState)