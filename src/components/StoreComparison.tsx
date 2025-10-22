/**
 * Store Comparison Component
 * 
 * Provides detailed comparison information between different state management
 * solutions including features, pros, cons, and use cases.
 */

import React from 'react'
import { STORE_CONFIGS, type StoreType } from '../hooks/storeAdapter'
import './StoreComparison.css'

// ============================================================================
// Store Comparison Interface
// ============================================================================

interface StoreComparisonProps {
  className?: string
}

// ============================================================================
// Individual Store Details Component
// ============================================================================

interface StoreDetailsProps {
  storeType: StoreType
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ storeType }) => {
  const config = STORE_CONFIGS[storeType]
  
  return (
    <div className="store-details-card">
      <header className="store-details-header">
        <h3 className="store-details-name">{config.name}</h3>
        <span className="store-details-type">{config.type}</span>
      </header>
      
      <p className="store-details-description">{config.description}</p>
      
      <div className="store-features-section">
        <h4>Key Features</h4>
        <ul className="features-list">
          {config.features.map((feature, index) => (
            <li key={index} className="feature-item">
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pros-cons-section">
        <div className="pros-section">
          <h4>Advantages</h4>
          <ul className="pros-list">
            {config.pros.map((pro, index) => (
              <li key={index} className="pro-item">
                ✓ {pro}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="cons-section">
          <h4>Trade-offs</h4>
          <ul className="cons-list">
            {config.cons.map((con, index) => (
              <li key={index} className="con-item">
                ⚠ {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
      

    </div>
  )
}

// ============================================================================
// Main Store Comparison Component
// ============================================================================

const StoreComparison: React.FC<StoreComparisonProps> = ({ className = '' }) => {
  const storeTypes: StoreType[] = ['zustand', 'redux', 'context']
  
  return (
    <div className={`store-comparison ${className}`}>
      <header className="comparison-header">
        <h2>State Management Solutions Comparison</h2>
        <p>
          Compare the different state management approaches available in this demo.
          Each solution has its own strengths and is suited for different use cases.
        </p>
      </header>
      
      <div className="comparison-grid">
        {storeTypes.map(storeType => (
          <StoreDetails key={storeType} storeType={storeType} />
        ))}
      </div>
      
      <footer className="comparison-footer">
        <h3>Which One Should You Choose?</h3>
        <div className="decision-guide">
          <div className="guide-item">
            <h4>🚀 Zustand</h4>
            <p>Choose for modern React apps that need simple, performant state management with minimal boilerplate.</p>
          </div>
          <div className="guide-item">
            <h4>⚙️ Redux Toolkit</h4>
            <p>Choose for complex applications with predictable state updates, time-travel debugging, and extensive ecosystem needs.</p>
          </div>
          <div className="guide-item">
            <h4>⚛️ React Context</h4>
            <p>Choose for simple state sharing or when you want to avoid external dependencies and use React's built-in solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StoreComparison