import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import CanvasDemoPage from './pages/CanvasDemoPage'
import ComparisonPage from './pages/ComparisonPage'
import NotFoundPage from './pages/NotFoundPage'

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
  return (
    <Router>
      <div className="app">
        {/* Navigation component with routing links */}
        <Navigation />
        
        {/* Main content area with route-based rendering */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<CanvasDemoPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
