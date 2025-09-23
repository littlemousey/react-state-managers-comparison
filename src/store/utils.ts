/**
 * Utility functions for canvas drawing operations
 * 
 * These pure functions handle common operations needed across all
 * state management implementations, ensuring consistent behavior.
 */

import type { Point, Shape, DrawingTool } from './types'

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generates a unique ID for shapes
 * Uses timestamp + random component for uniqueness
 */
export const generateShapeId = (): string => {
  return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// Shape Creation
// ============================================================================

/**
 * Creates a new shape from drawing data
 */
export const createShape = (
  points: Point[],
  color: string,
  type: DrawingTool
): Shape => {
  return {
    id: generateShapeId(),
    points: [...points], // Create a copy to avoid mutations
    color,
    type,
    timestamp: Date.now()
  }
}

// ============================================================================
// Canvas Rendering
// ============================================================================

/**
 * Renders a single shape on the canvas context
 */
export const renderShape = (ctx: CanvasRenderingContext2D, shape: Shape): void => {
  if (shape.points.length === 0) return

  ctx.save()
  ctx.strokeStyle = shape.color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()

  switch (shape.type) {
    case 'pen': {
      // Freehand drawing - connect all points
      const [firstPoint, ...restPoints] = shape.points
      ctx.moveTo(firstPoint.x, firstPoint.y)
      
      restPoints.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
      break
    }
    
    case 'rectangle': {
      // Rectangle - use first and last points as corners
      if (shape.points.length >= 2) {
        const start = shape.points[0]
        const end = shape.points[shape.points.length - 1]
        
        const width = end.x - start.x
        const height = end.y - start.y
        
        ctx.strokeRect(start.x, start.y, width, height)
      }
      break
    }
    
    case 'circle': {
      // Circle - use first and last points to determine radius
      if (shape.points.length >= 2) {
        const center = shape.points[0]
        const edge = shape.points[shape.points.length - 1]
        
        const radius = Math.sqrt(
          Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
        )
        
        ctx.beginPath()
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }
      break
    }
  }

  ctx.restore()
}

/**
 * Renders all shapes on the canvas
 */
export const renderAllShapes = (
  ctx: CanvasRenderingContext2D, 
  shapes: Shape[]
): void => {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
  // Render each shape
  shapes.forEach(shape => renderShape(ctx, shape))
}

/**
 * Renders the current drawing path (preview while drawing)
 */
export const renderCurrentPath = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  tool: DrawingTool
): void => {
  if (points.length === 0) return

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.7 // Slightly transparent for preview

  ctx.beginPath()

  switch (tool) {
    case 'pen': {
      // Show the drawing path as it's being drawn
      const [firstPoint, ...restPoints] = points
      ctx.moveTo(firstPoint.x, firstPoint.y)
      
      restPoints.forEach(point => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
      break
    }
    
    case 'rectangle': {
      // Show rectangle preview
      if (points.length >= 2) {
        const start = points[0]
        const current = points[points.length - 1]
        
        const width = current.x - start.x
        const height = current.y - start.y
        
        ctx.strokeRect(start.x, start.y, width, height)
      }
      break
    }
    
    case 'circle': {
      // Show circle preview
      if (points.length >= 2) {
        const center = points[0]
        const current = points[points.length - 1]
        
        const radius = Math.sqrt(
          Math.pow(current.x - center.x, 2) + Math.pow(current.y - center.y, 2)
        )
        
        ctx.beginPath()
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }
      break
    }
  }

  ctx.restore()
}

// ============================================================================
// History Management
// ============================================================================

/**
 * Adds a state to history, managing history size and index
 */
export const addToHistory = (
  currentHistory: Shape[][],
  currentIndex: number,
  newState: Shape[],
  maxHistorySize: number = 50
): { history: Shape[][], historyIndex: number } => {
  // Remove any history after current index (for when we're not at the end)
  const truncatedHistory = currentHistory.slice(0, currentIndex + 1)
  
  // Add new state
  const newHistory = [...truncatedHistory, [...newState]]
  
  // Limit history size
  const finalHistory = newHistory.length > maxHistorySize 
    ? newHistory.slice(-maxHistorySize)
    : newHistory
  
  return {
    history: finalHistory,
    historyIndex: finalHistory.length - 1
  }
}

/**
 * Checks if undo is possible
 */
export const canUndo = (historyIndex: number): boolean => {
  return historyIndex > 0
}

/**
 * Checks if redo is possible
 */
export const canRedo = (historyIndex: number, historyLength: number): boolean => {
  return historyIndex < historyLength - 1
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validates if a color string is a valid hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

/**
 * Validates if a point is within canvas bounds
 */
export const isPointInBounds = (
  point: Point, 
  canvasWidth: number, 
  canvasHeight: number
): boolean => {
  return point.x >= 0 && 
         point.x <= canvasWidth && 
         point.y >= 0 && 
         point.y <= canvasHeight
}

/**
 * Clamps a point to canvas bounds
 */
export const clampPointToBounds = (
  point: Point,
  canvasWidth: number,
  canvasHeight: number
): Point => {
  return {
    x: Math.max(0, Math.min(canvasWidth, point.x)),
    y: Math.max(0, Math.min(canvasHeight, point.y))
  }
}