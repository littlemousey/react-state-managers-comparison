/**
 * Shared Type Definitions for Canvas Drawing App
 * 
 * These interfaces define the common data structures used across all three
 * state management approaches (Zustand, Redux Toolkit, React Context).
 * 
 * By keeping these types consistent, we can ensure that all three state
 * managers handle the same data in the same way, making the comparison fair.
 */

// ============================================================================
// Core Drawing Types
// ============================================================================

/**
 * Represents a point in 2D space
 * Used for tracking mouse/touch coordinates and drawing paths
 */
export interface Point {
  x: number
  y: number
}

/**
 * Supported drawing tools
 */
export type DrawingTool = 'pen' | 'rectangle' | 'circle'

/**
 * Represents a complete drawing shape
 * Each shape contains all the data needed to render it on the canvas
 */
export interface Shape {
  /** Unique identifier for the shape */
  id: string
  
  /** Array of points that make up the shape's path */
  points: Point[]
  
  /** Color of the shape (hex format: #RRGGBB) */
  color: string
  
  /** Type of drawing tool used to create this shape */
  type: DrawingTool
  
  /** Timestamp when the shape was created */
  timestamp: number
}

// ============================================================================
// Application State
// ============================================================================

/**
 * Complete canvas application state
 * This represents the entire global state that needs to be managed
 */
export interface CanvasState {
  /** All shapes currently drawn on the canvas */
  shapes: Shape[]
  
  /** Currently selected color for new shapes */
  currentColor: string
  
  /** Currently selected drawing tool */
  currentTool: DrawingTool
  
  /** History stack for undo functionality - each entry is a complete shapes array */
  history: Shape[][]
  
  /** Current position in history (for undo/redo) */
  historyIndex: number
  
  /** Whether the canvas is currently in drawing mode */
  isDrawing: boolean
  
  /** Current drawing path (points being drawn before completion) */
  currentPath: Point[]
}

// ============================================================================
// Action Types
// ============================================================================

/**
 * Standard action interface that all state managers will implement
 * This ensures consistent API across Zustand, Redux, and Context
 */
export interface CanvasActions {
  /** Add a completed shape to the canvas */
  addShape: (shape: Omit<Shape, 'id' | 'timestamp'>) => void
  
  /** Change the current drawing color */
  changeColor: (color: string) => void
  
  /** Change the current drawing tool */
  changeTool: (tool: DrawingTool) => void
  
  /** Start drawing (set isDrawing to true and initialize currentPath) */
  startDrawing: (startPoint: Point) => void
  
  /** Continue drawing (add point to currentPath) */
  continueDrawing: (point: Point) => void
  
  /** Finish drawing (convert currentPath to shape and add to shapes) */
  finishDrawing: () => void
  
  /** Undo the last action */
  undo: () => void
  
  /** Redo the previously undone action */
  redo: () => void
  
  /** Clear all shapes from the canvas */
  clear: () => void
  
  /** Reset the entire state to initial values */
  reset: () => void
}

// ============================================================================
// Store Interface
// ============================================================================

/**
 * Combined interface that represents the complete store API
 * This is what our adapter hooks will return to ensure consistency
 */
export interface CanvasStore extends CanvasState, CanvasActions {}

// ============================================================================
// Initial State
// ============================================================================

/**
 * Default initial state for the canvas
 * Used by all state management implementations as their starting point
 */
export const initialCanvasState: CanvasState = {
  shapes: [],
  currentColor: '#000000',
  currentTool: 'pen',
  history: [[]],
  historyIndex: 0,
  isDrawing: false,
  currentPath: []
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Available color palette for the drawing app
 */
export const AVAILABLE_COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark Green
] as const

/**
 * Type for available colors (derived from AVAILABLE_COLORS)
 */
export type AvailableColor = typeof AVAILABLE_COLORS[number]

/**
 * Configuration for drawing tools
 */
export interface ToolConfig {
  name: string
  icon: string
  description: string
}

/**
 * Tool configurations for UI display
 */
export const TOOL_CONFIGS: Record<DrawingTool, ToolConfig> = {
  pen: {
    name: 'Pen',
    icon: '✏️',
    description: 'Freehand drawing'
  },
  rectangle: {
    name: 'Rectangle',
    icon: '⬛',
    description: 'Draw rectangles'
  },
  circle: {
    name: 'Circle',
    icon: '⭕',
    description: 'Draw circles'
  }
} as const