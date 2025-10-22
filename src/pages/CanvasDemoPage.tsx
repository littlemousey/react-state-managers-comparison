/**
 * Canvas Demo Page
 *
 * Contains the interactive canvas drawing application with state management
 * comparison functionality. This is the main demo page that was previously
 * the entire App component.
 */

import { useState } from "react";
import { CanvasEditor } from "../components/CanvasEditor";
import Toolbar from "../components/Toolbar";
import StoreManager from "../components/StoreManager";
import InfoPanel from "../components/InfoPanel";
import "./CanvasDemoPage.css";
import StateDebugger from "../components/StateDebugger";

// ============================================================================
// Canvas Demo Page Component
// ============================================================================

const CanvasDemoPage: React.FC = () => {
  // State for toggling the InfoPanel overlay
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  return (
    <div className="canvas-demo-page">
      {/* StoreManager provides the selected store context to all children */}
      <StoreManager defaultStore="zustand">
        {/* Drawing Controls Toolbar */}
        <Toolbar className="demo-toolbar" />

        {/* Main content area */}
        <div className="demo-content">
          {/* Header with title and info toggle */}
          <header className="demo-header">
            <div className="header-content">
              <div>
                <h1>Interactive Canvas Drawing</h1>
                <p>
                  Experience the same drawing app powered by different state
                  managers
                </p>
              </div>
              {/* Toggle button for the comprehensive guide overlay */}
              <button
                className="info-toggle-btn"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                title={showInfoPanel ? "Hide Guide" : "Show Guide"}
                aria-label={
                  showInfoPanel
                    ? "Hide comparison guide"
                    : "Show comparison guide"
                }
              >
                {showInfoPanel ? "❌ Close Guide" : "📖 Quick Guide"}
              </button>
            </div>
          </header>

          {/* Interactive canvas drawing component */}
          <main className="demo-main">
            <CanvasEditor />

            {/* Conditional InfoPanel overlay with comprehensive state management guide */}
            {showInfoPanel && (
              <div className="info-panel-overlay">
                <InfoPanel />
              </div>
            )}
          </main>

          {/* Add StateDebugger at the bottom */}
          <div className="debug-panel">
            <StateDebugger />
          </div>
        </div>
      </StoreManager>
    </div>
  );
};

export default CanvasDemoPage;
