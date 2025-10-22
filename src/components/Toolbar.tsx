/**
 * Toolbar Component
 *
 * Horizontal toolbar with all drawing controls:
 * - Color picker, tools, actions, and stats in a compact horizontal layout
 * - Maximizes canvas space by using horizontal real estate efficiently
 */

import React from "react";
import { useCanvasStore } from "../hooks";
import type { DrawingTool } from "../store/types";
import "./Toolbar.css";

// ============================================================================
// Constants
// ============================================================================

const COLOR_PALETTE = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#FFFFFF",
];

const DRAWING_TOOLS: Array<{
  id: DrawingTool;
  name: string;
  icon: string;
}> = [
  { id: "pen", name: "Pen", icon: "✏️" },
  { id: "rectangle", name: "Rectangle", icon: "⬜" },
  { id: "circle", name: "Circle", icon: "⭕" },
];

// ============================================================================
// Toolbar Component
// ============================================================================

interface ToolbarProps {
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ className = "" }) => {
  const canvasStore = useCanvasStore();

  const canUndo = canvasStore.historyIndex > 0;
  const canRedo = canvasStore.historyIndex < canvasStore.history.length - 1;

  return (
    <div className={`toolbar ${className}`}>
      <div>
        {/* Tools Section */}
        <div className="toolbar-section tools-section">
          <span className="section-label">Tools:</span>
          <div className="tool-buttons">
            {DRAWING_TOOLS.map((tool) => (
              <button
                key={tool.id}
                className={`tool-btn ${
                  canvasStore.currentTool === tool.id ? "active" : ""
                }`}
                onClick={() => canvasStore.changeTool(tool.id)}
                title={tool.name}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="toolbar-section colors-section">
          <span className="section-label">Colors:</span>
          <div className="color-palette">
            {COLOR_PALETTE.slice(0, 8).map((color) => (
              <button
                key={color}
                className={`color-btn ${
                  canvasStore.currentColor === color ? "active" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => canvasStore.changeColor(color)}
                title={color}
              />
            ))}
            <input
              type="color"
              value={canvasStore.currentColor}
              onChange={(e) => canvasStore.changeColor(e.target.value)}
              className="custom-color-btn"
              title="Custom color"
            />
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div>
        <div className="toolbar-section actions-section">
          <span className="section-label">Actions:</span>
          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={canvasStore.undo}
              disabled={!canUndo}
              title="Undo"
            >
              ↶
            </button>
            <button
              className="action-btn"
              onClick={canvasStore.redo}
              disabled={!canRedo}
              title="Redo"
            >
              ↷
            </button>
            <button
              className="action-btn clear-btn"
              onClick={canvasStore.clear}
              disabled={canvasStore.shapes.length === 0}
              title="Clear canvas"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="toolbar-section history-section">
          <span className="section-label">History:</span>
          <div className="history-controls">
            <select
              className="history-dropdown"
              value={canvasStore.historyIndex}
              onChange={(e) => {
                const targetIndex = parseInt(e.target.value);
                const steps = targetIndex - canvasStore.historyIndex;
                if (steps < 0) {
                  for (let i = 0; i < Math.abs(steps); i++) {
                    canvasStore.undo();
                  }
                } else if (steps > 0) {
                  for (let i = 0; i < steps; i++) {
                    canvasStore.redo();
                  }
                }
              }}
              disabled={canvasStore.history.length <= 1}
            >
              {canvasStore.history.map((historyState, index) => (
                <option key={index} value={index}>
                  Step {index + 1}: {historyState.length} shapes
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Section */}
        <div className="toolbar-section stats-section">
          <span className="section-label">Canvas:</span>
          <div className="canvas-stats">
            <span className="stat">{canvasStore.shapes.length} shapes</span>
            <span className="stat">
              {canvasStore.isDrawing ? "✏️ Drawing" : "⏸️ Idle"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
