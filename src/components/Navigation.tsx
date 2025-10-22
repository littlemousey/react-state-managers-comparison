/**
 * Navigation Component
 * 
 * Provides navigation between the main canvas application and the
 * detailed state management comparison page.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

// ============================================================================
// Navigation Interface
// ============================================================================

interface NavigationProps {
  className?: string
}

// ============================================================================
// Navigation Links Configuration
// ============================================================================

const navigationLinks = [
  {
    path: '/',
    label: 'Canvas Demo',
    icon: '🎨',
    description: 'Interactive drawing canvas with state management comparison'
  },
  {
    path: '/comparison',
    label: 'Detailed Comparison',
    icon: '📊',
    description: 'In-depth analysis of state management solutions'
  }
]

// ============================================================================
// Navigation Component
// ============================================================================

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const location = useLocation()
  
  return (
    <nav className={`navigation ${className}`}>
      <div className="nav-content">
        <div className="nav-brand">
          <h2>React State Managers</h2>
          <span className="nav-subtitle">Comparison Demo</span>
        </div>
        
        <div className="nav-links">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              title={link.description}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation