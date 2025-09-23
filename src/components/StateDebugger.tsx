/**
 * StateDebugger Component
 * 
 * A comprehensive real-time state inspection tool that works across all three
 * state management implementations (Zustand, Redux Toolkit, React Context).
 * 
 * Features:
 * • Real-time state monitoring with automatic updates
 * • Expandable sections for organized state inspection  
 * • JSON export with copy-to-clipboard functionality
 * • Performance metrics and metadata display
 * • Cross-store compatibility through universal adapter
 * 
 * Usage:
 * - Automatically detects the active store implementation
 * - Updates in real-time as users interact with the canvas
 * - Provides detailed breakdowns of shapes, history, and internal state
 * - Enables developers to compare state structures across implementations
 * 
 * Architecture:
 * - Uses useCanvasStoreWithType hook for store-agnostic access
 * - Formats raw state data into developer-friendly summaries
 * - Implements collapsible UI for managing information density
 * - Provides consistent debugging experience regardless of active store
 */

import React, { useState, useCallback, useMemo } from 'react'
import { useCanvasStoreWithType } from '../hooks/useCanvasStoreHooks'
import type { Point, Shape, CanvasStore } from '../store/types'

// ============================================================================
// JSON Formatting Utilities
// ============================================================================

interface ShapeSummary {
  id: string
  pointsCount: number
  color: string
  type: string
  timestamp: number
  firstPoint: Point
  lastPoint: Point
}

interface HistoryEntry {
  index: number
  shapesCount: number
  summary: string
}

interface FormattedStateData {
  timestamp: string
  storeType: string
  storeName: string
  state: {
    shapes: ShapeSummary[]
    history: HistoryEntry[]
    currentHistoryIndex: number
    isDrawing: boolean
    currentColor: string
    currentTool: string
    currentPath: Point[]
  }
  actions: string[]
  metadata: {
    shapesCount: number
    historyLength: number
    currentHistoryIndex: number
    isDrawing: boolean
  }
}

const formatStateForDisplay = (
  canvasStore: CanvasStore,
  storeType: string
): FormattedStateData => {
  const now = new Date()
  
  return {
    timestamp: now.toLocaleTimeString(),
    storeType,
    storeName: `${storeType} Store`,
    state: {
      shapes: canvasStore.shapes?.map((shape: Shape) => ({
        id: shape.id,
        pointsCount: shape.points.length,
        color: shape.color,
        type: shape.type,
        timestamp: shape.timestamp,
        firstPoint: shape.points[0],
        lastPoint: shape.points[shape.points.length - 1],
      })) || [],
      currentColor: canvasStore.currentColor || '#000000',
      currentTool: canvasStore.currentTool || 'pen',
      currentPath: canvasStore.currentPath || [],
      history: canvasStore.history?.map((shapesArray: Shape[], index: number) => ({
        index,
        shapesCount: shapesArray.length,
        summary: `History ${index}: ${shapesArray.length} shapes`
      })) || [],
      currentHistoryIndex: canvasStore.historyIndex || 0,
      isDrawing: canvasStore.isDrawing || false
    },
    actions: [
      'startDrawing',
      'addPoint', 
      'endDrawing',
      'undo',
      'redo',
      'clear',
      'setColor',
      'setTool'
    ],
    metadata: {
      shapesCount: canvasStore.shapes?.length || 0,
      historyLength: canvasStore.history?.length || 0,
      currentHistoryIndex: canvasStore.historyIndex || 0,
      isDrawing: canvasStore.isDrawing || false
    }
  }
}

// ============================================================================
// Copy to Clipboard Functionality
// ============================================================================

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [])

  return { copyToClipboard, isCopied }
}

// ============================================================================
// State Inspector Component
// ============================================================================

interface StateInspectorProps {
  data: FormattedStateData
  className?: string
}

const StateInspector: React.FC<StateInspectorProps> = ({ data, className = '' }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    metadata: true,
    state: false,
    shapes: false,
    history: false,
    actions: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const jsonString = useMemo(() => {
    return JSON.stringify(data, null, 2)
  }, [data])

  return (
    <div className={`state-inspector ${className}`}>
      <div className="inspector-header">
        <div className="store-info">
          <h4>🔍 {data.storeName} State Inspector</h4>
          <div className="store-badges">
            <span className="store-type-badge">{data.storeType}</span>
            <span className="timestamp-badge">{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <button
          className={`copy-button ${isCopied ? 'copied' : ''}`}
          onClick={() => copyToClipboard(jsonString)}
          title="Copy full state as JSON"
        >
          {isCopied ? '✓ Copied!' : '📋 Copy JSON'}
        </button>
      </div>

      <div className="inspector-content">
        {/* Quick Metadata */}
        <div className="inspector-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('metadata')}
            aria-expanded={expandedSections.metadata}
          >
            <span className="toggle-icon">{expandedSections.metadata ? '▼' : '▶'}</span>
            📊 Quick Stats
          </button>
          
          {expandedSections.metadata && (
            <div className="section-content metadata-grid">
              <div className="stat-card">
                <span className="stat-label">Shapes</span>
                <span className="stat-value">{data.metadata.shapesCount}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">History</span>
                <span className="stat-value">{data.metadata.historyLength}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Position</span>
                <span className="stat-value">{data.metadata.currentHistoryIndex + 1}/{data.metadata.historyLength}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Drawing</span>
                <span className={`stat-value ${data.metadata.isDrawing ? 'active' : ''}`}>
                  {data.metadata.isDrawing ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Current State */}
        <div className="inspector-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('state')}
            aria-expanded={expandedSections.state}
          >
            <span className="toggle-icon">{expandedSections.state ? '▼' : '▶'}</span>
            🎨 Current State
          </button>
          
          {expandedSections.state && (
            <div className="section-content">
              <pre className="json-display">
                {JSON.stringify({
                  currentColor: data.state.currentColor,
                  currentTool: data.state.currentTool,
                  historyIndex: data.state.currentHistoryIndex,
                  isDrawing: data.state.isDrawing,
                  currentPath: data.state.currentPath
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Shapes Data */}
        <div className="inspector-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('shapes')}
            aria-expanded={expandedSections.shapes}
          >
            <span className="toggle-icon">{expandedSections.shapes ? '▼' : '▶'}</span>
            🎯 Shapes ({data.state.shapes.length})
          </button>
          
          {expandedSections.shapes && (
            <div className="section-content">
              {data.state.shapes.length > 0 ? (
                <pre className="json-display">
                  {JSON.stringify(data.state.shapes, null, 2)}
                </pre>
              ) : (
                <div className="empty-state">No shapes drawn yet</div>
              )}
            </div>
          )}
        </div>

        {/* History Data */}
        <div className="inspector-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('history')}
            aria-expanded={expandedSections.history}
          >
            <span className="toggle-icon">{expandedSections.history ? '▼' : '▶'}</span>
            📚 History ({data.state.history.length})
          </button>
          
          {expandedSections.history && (
            <div className="section-content">
              <pre className="json-display">
                {JSON.stringify(data.state.history, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Available Actions */}
        <div className="inspector-section">
          <button
            className="section-toggle"
            onClick={() => toggleSection('actions')}
            aria-expanded={expandedSections.actions}
          >
            <span className="toggle-icon">{expandedSections.actions ? '▼' : '▶'}</span>
            ⚡ Available Actions
          </button>
          
          {expandedSections.actions && (
            <div className="section-content">
              <div className="actions-grid">
                {data.actions.map(action => (
                  <span key={action} className="action-badge">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main State Debugger Component
// ============================================================================

interface StateDebuggerProps {
  className?: string
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
}

const StateDebugger: React.FC<StateDebuggerProps> = ({
  className = '',
  isCollapsed = false,
  onToggleCollapsed
}) => {
  const { store: canvasStore, storeType } = useCanvasStoreWithType()
  
  const formattedData = useMemo(() => {
    return formatStateForDisplay(canvasStore, storeType)
  }, [canvasStore, storeType])

  if (isCollapsed) {
    return (
      <div className={`state-debugger collapsed ${className}`}>
        <button
          className="debugger-toggle"
          onClick={onToggleCollapsed}
          title="Expand State Debugger"
        >
          🔍 State Debugger ({formattedData.metadata.shapesCount} shapes)
        </button>
      </div>
    )
  }

  return (
    <div className={`state-debugger ${className}`}>
      <div className="debugger-header">
        <h3>🛠️ State Debugger</h3>
        {onToggleCollapsed && (
          <button
            className="collapse-button"
            onClick={onToggleCollapsed}
            title="Collapse State Debugger"
          >
            ✕
          </button>
        )}
      </div>
      
      <StateInspector data={formattedData} />
    </div>
  )
}

export default StateDebugger
export type { StateDebuggerProps }