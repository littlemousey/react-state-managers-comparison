import { useRef, useEffect, useCallback } from 'react'
import './CanvasEditor.css'
import type { Point } from '../store/types'
import { useCanvasStore } from '../hooks'

/**
 * CanvasEditor Component
 * 
 * Provides an interactive HTML canvas that supports:
 * - Freehand drawing with mouse and touch events
 * - Responsive sizing that fills most of the viewport
 * - Integration with universal store for state management
 * 
 * Now connected to our universal store system for consistent state management.
 */

export const CanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasStore = useCanvasStore()

  // Initialize canvas context and setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up drawing styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000000'

    // Set canvas size to match display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Redraw canvas when shapes change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
    
    // Draw all shapes
    canvasStore.shapes.forEach(shape => {
      if (shape.points.length < 2) return
      
      ctx.beginPath()
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      const firstPoint = shape.points[0]
      ctx.moveTo(firstPoint.x, firstPoint.y)
      
      for (let i = 1; i < shape.points.length; i++) {
        const point = shape.points[i]
        ctx.lineTo(point.x, point.y)
      }
      
      ctx.stroke()
    })
  }, [canvasStore.shapes])

  // Get point coordinates relative to canvas
  const getPointFromEvent = useCallback((event: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number

    if (event instanceof MouseEvent) {
      clientX = event.clientX
      clientY = event.clientY
    } else {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }, [])

  // Start drawing
  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    
    const point = getPointFromEvent(event.nativeEvent)
    canvasStore.startDrawing(point)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = canvasStore.currentColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    }
  }, [getPointFromEvent, canvasStore])

  // Continue drawing
  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasStore.isDrawing) return
    event.preventDefault()

    const point = getPointFromEvent(event.nativeEvent)
    canvasStore.continueDrawing(point)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }, [getPointFromEvent, canvasStore])

  // Stop drawing
  const stopDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasStore.isDrawing) return
    event.preventDefault()
    
    canvasStore.finishDrawing()
  }, [canvasStore])

  // Touch event handlers (prevent scrolling while drawing)
  const handleTouchStart = (event: React.TouchEvent) => {
    startDrawing(event)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    draw(event)
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    stopDrawing(event)
  }

  return (
    <div className="canvas-editor">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Debug info */}
      <div className="canvas-debug">
        {canvasStore.isDrawing && (
          <span>Drawing... Points: {canvasStore.currentPath.length}</span>
        )}
      </div>
    </div>
  )
}