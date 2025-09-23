import { useState } from 'react'
import './App.css'
import { CanvasEditor } from './components/CanvasEditor'
import Sidebar from './components/Sidebar'
import StoreManager from './components/StoreManager'
import InfoPanel from './components/InfoPanel'

/**
 * Main App Component - React State Managers Comparison
 * 
 * This application provides a comprehensive comparison of three popular React
 * state management solutions through an interactive canvas drawing experience:
 * 
 * • Zustand - Lightweight store with minimal boilerplate
 * • Redux Toolkit - Modern Redux with enhanced developer experience  
 * • React Context API - Built-in React state management
 * 
 * Key Features:
 * - Runtime switching between state management implementations
 * - Identical functionality across all three approaches
 * - Real-time state debugging and inspection
 * - Performance comparison through interactive use
 * - Comprehensive documentation and trade-off analysis
 * 
 * Architecture:
 * - Universal Store Adapter pattern for consistent interfaces
 * - Component isolation from specific state management details
 * - Shared TypeScript interfaces for type safety
 * - Modular component structure for maintainability
 */
function App() {
  // State for toggling the InfoPanel overlay
  const [showInfoPanel, setShowInfoPanel] = useState(false)

  return (
    <div className="app">
      {/* StoreManager provides the selected store context to all children */}
      <StoreManager defaultStore="zustand">
        {/* Left sidebar with drawing controls and debugging tools */}
        <Sidebar className="app-sidebar" />
        
        <div className="app-content">
          <header className="app-header">
            <div className="header-content">
              <div>
                <h1>React State Managers Comparison</h1>
                <p>Canvas Drawing App - Zustand vs Redux Toolkit vs Context API</p>
              </div>
              {/* Toggle button for the comprehensive guide overlay */}
              <button 
                className="info-toggle-btn"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                title={showInfoPanel ? "Hide Guide" : "Show Guide"}
                aria-label={showInfoPanel ? "Hide comparison guide" : "Show comparison guide"}
              >
                {showInfoPanel ? '❌ Close Guide' : '📖 Show Guide'}
              </button>
            </div>
          </header>
          
          <main className="app-main">
            {/* Interactive canvas drawing component */}
            <CanvasEditor />
            
            {/* Conditional InfoPanel overlay with comprehensive state management guide */}
            {showInfoPanel && (
              <div className="info-panel-overlay">
                <InfoPanel />
              </div>
            )}
          </main>
        </div>
      </StoreManager>
    </div>
  )
}

export default App
