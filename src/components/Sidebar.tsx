/**
 * Sidebar Component
 * 
 * Provides all the drawing controls for the canvas application:
 * - Color picker
 * - Tool selector 
 * - Undo/Redo buttons
 * - Clear canvas button
 * - Current state display
 */

import React from 'react'
import { useCanvasStore } from '../hooks'
import type { DrawingTool } from '../store/types'
import StateDebugger from './StateDebugger'
import './Sidebar.css'

// ============================================================================
// Color Palette
// ============================================================================

const COLOR_PALETTE = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFFFFF', // White
]

// ============================================================================
// Tool Configuration
// ============================================================================

const DRAWING_TOOLS: Array<{
  id: DrawingTool
  name: string
  icon: string
  description: string
}> = [
  {
    id: 'pen',
    name: 'Pen',
    icon: '✏️',
    description: 'Freehand drawing'
  },
  {
    id: 'rectangle',
    name: 'Rectangle', 
    icon: '⬜',
    description: 'Draw rectangles'
  },
  {
    id: 'circle',
    name: 'Circle',
    icon: '⭕',
    description: 'Draw circles'
  }
]

// ============================================================================
// Color Picker Component
// ============================================================================

interface ColorPickerProps {
  currentColor: string
  onColorChange: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
  return (
    <div className="color-picker">
      <h3 className="control-title">Colors</h3>
      <div className="color-grid">
        {COLOR_PALETTE.map(color => (
          <button
            key={color}
            className={`color-button ${currentColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={`Select ${color}`}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      
      {/* Custom color input */}
      <div className="custom-color">
        <label htmlFor="custom-color-input">Custom:</label>
        <input
          id="custom-color-input"
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="custom-color-input"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Tool Selector Component
// ============================================================================

interface ToolSelectorProps {
  currentTool: DrawingTool
  onToolChange: (tool: DrawingTool) => void
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ currentTool, onToolChange }) => {
  return (
    <div className="tool-selector">
      <h3 className="control-title">Tools</h3>
      <div className="tool-grid">
        {DRAWING_TOOLS.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${currentTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.description}
            aria-label={`Select ${tool.name} tool`}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Action Buttons Component
// ============================================================================

interface ActionButtonsProps {
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  canUndo: boolean
  canRedo: boolean
  shapesCount: number
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onUndo,
  onRedo, 
  onClear,
  canUndo,
  canRedo,
  shapesCount
}) => {
  return (
    <div className="action-buttons">
      <h3 className="control-title">Actions</h3>
      
      <div className="button-group">
        <button
          className="action-button undo-button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last action"
          aria-label="Undo"
        >
          ↶ Undo
        </button>
        
        <button
          className="action-button redo-button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo last undone action"
          aria-label="Redo"
        >
          ↷ Redo
        </button>
      </div>
      
      <button
        className="action-button clear-button"
        onClick={onClear}
        disabled={shapesCount === 0}
        title="Clear entire canvas"
        aria-label="Clear canvas"
      >
        🗑️ Clear Canvas
      </button>
    </div>
  )
}

// ============================================================================
// Canvas Stats Component
// ============================================================================

interface CanvasStatsProps {
  shapesCount: number
  currentColor: string
  currentTool: DrawingTool
  historyPosition: string
  isDrawing: boolean
}

const CanvasStats: React.FC<CanvasStatsProps> = ({
  shapesCount,
  currentColor,
  currentTool,
  historyPosition,
  isDrawing
}) => {
  return (
    <div className="canvas-stats">
      <h3 className="control-title">Canvas Info</h3>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Shapes:</span>
          <span className="stat-value">{shapesCount}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Tool:</span>
          <span className="stat-value">{currentTool}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Color:</span>
          <div className="color-preview" style={{ backgroundColor: currentColor }} />
          <span className="stat-value">{currentColor}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">History:</span>
          <span className="stat-value">{historyPosition}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className={`stat-value ${isDrawing ? 'drawing' : ''}`}>
            {isDrawing ? '✏️ Drawing' : '⏸️ Idle'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Sidebar Component
// ============================================================================

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  // Use the universal canvas store
  const canvasStore = useCanvasStore()
  
  // Calculate derived state for UI
  const canUndo = canvasStore.historyIndex > 0
  const canRedo = canvasStore.historyIndex < canvasStore.history.length - 1
  const historyPosition = `${canvasStore.historyIndex + 1}/${canvasStore.history.length}`
  
  return (
    <div className={`sidebar ${className}`}>
      <header className="sidebar-header">
        <h2>Drawing Controls</h2>
      </header>
      
      <div className="sidebar-content">
        <ColorPicker 
          currentColor={canvasStore.currentColor}
          onColorChange={canvasStore.changeColor}
        />
        
        <ToolSelector
          currentTool={canvasStore.currentTool}
          onToolChange={canvasStore.changeTool}
        />
        
        <ActionButtons
          onUndo={canvasStore.undo}
          onRedo={canvasStore.redo}
          onClear={canvasStore.clear}
          canUndo={canUndo}
          canRedo={canRedo}
          shapesCount={canvasStore.shapes.length}
        />
        
        <CanvasStats
          shapesCount={canvasStore.shapes.length}
          currentColor={canvasStore.currentColor}
          currentTool={canvasStore.currentTool}
          historyPosition={historyPosition}
          isDrawing={canvasStore.isDrawing}
        />
        
        <StateDebugger />
      </div>
    </div>
  )
}

export default Sidebar