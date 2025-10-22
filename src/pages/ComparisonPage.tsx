/**
 * Comparison Page
 * 
 * Dedicated page for detailed comparison of state management solutions.
 * This page provides comprehensive information about Zustand, Redux Toolkit,
 * and React Context API including features, pros, cons, and usage guidance.
 */

import React from 'react'
import StoreComparison from '../components/StoreComparison'
import './ComparisonPage.css'

// ============================================================================
// Comparison Page Component
// ============================================================================

const ComparisonPage: React.FC = () => {
  return (
    <div className="comparison-page">
      <div className="comparison-container">
        <StoreComparison />
        
        <div className="page-actions">
          <div className="action-card">
            <h3>🎨 Try the Interactive Demo</h3>
            <p>
              Experience these state management solutions in action with our 
              interactive canvas drawing application.
            </p>
            <a href="/" className="action-button primary">
              Go to Canvas Demo
            </a>
          </div>
          
          <div className="action-card">
            <h3>📚 Learn More</h3>
            <p>
              Dive deeper into each state management solution with official 
              documentation and community resources.
            </p>
            <div className="resource-links">
              <a 
                href="https://zustand-demo.pmnd.rs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Zustand Docs
              </a>
              <a 
                href="https://redux-toolkit.js.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Redux Toolkit
              </a>
              <a 
                href="https://react.dev/reference/react/useContext" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                React Context
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonPage