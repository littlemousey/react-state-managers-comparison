/**
 * Not Found Page
 * 
 * 404 error page for unmatched routes
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './NotFoundPage.css'

// ============================================================================
// Not Found Page Component
// ============================================================================

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-icon">🤖</div>
        <h1>404 - Page Not Found</h1>
        <p>
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="navigation-options">
          <Link to="/" className="nav-option primary">
            🎨 Go to Canvas Demo
          </Link>
          <Link to="/comparison" className="nav-option">
            📊 View Comparison
          </Link>
        </div>
        
        <div className="help-text">
          <p>
            <strong>Available pages:</strong>
          </p>
          <ul>
            <li><code>/</code> - Interactive canvas drawing demo</li>
            <li><code>/comparison</code> - Detailed state management comparison</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage