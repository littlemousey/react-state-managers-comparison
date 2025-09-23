/**
 * Store Selector Component
 * 
 * Provides a user interface for switching between different state management
 * solutions at runtime. This allows users to compare Zustand, Redux Toolkit,
 * and React Context API side-by-side with the same application.
 */

import React from 'react'
import type { StoreType } from '../hooks/storeAdapter'
import { STORE_CONFIGS } from '../hooks/storeAdapter'
import './StoreSelector.css'

// ============================================================================
// Store Toggle Interface
// ============================================================================

interface StoreSelectorProps {
  currentStore: StoreType
  onStoreChange: (storeType: StoreType) => void
  className?: string
}

// ============================================================================
// Store Information Display
// ============================================================================

interface StoreInfoProps {
  storeType: StoreType
  isActive: boolean
  onSelect: () => void
}

const StoreInfo: React.FC<StoreInfoProps> = ({ storeType, isActive, onSelect }) => {
  const config = STORE_CONFIGS[storeType]
  
  return (
    <button
      className={`store-option ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      aria-pressed={isActive}
      title={`Switch to ${config.name}`}
    >
      <div className="store-header">
        <h4 className="store-name">{config.name}</h4>
        <span className="store-badge">{isActive ? '✓ Active' : 'Select'}</span>
      </div>
      
      <p className="store-description">{config.description}</p>
      
      <div className="store-features">
        <div className="feature-list">
          {config.pros.slice(0, 2).map((pro, index) => (
            <span key={index} className="feature-item positive">
              ✓ {pro}
            </span>
          ))}
        </div>
      </div>
      
      <div className="store-metrics">
        <span className="metric">
          <span className="metric-label">Features:</span>
          <span className="metric-value">{config.features.length}</span>
        </span>
        <span className="metric">
          <span className="metric-label">Type:</span>
          <span className="metric-value">{config.type}</span>
        </span>
      </div>
    </button>
  )
}

// ============================================================================
// Main Store Selector Component
// ============================================================================

const StoreSelector: React.FC<StoreSelectorProps> = ({
  currentStore,
  onStoreChange,
  className = ''
}) => {
  const storeTypes: StoreType[] = ['zustand', 'redux', 'context']
  
  return (
    <div className={`store-selector ${className}`}>
      <header className="selector-header">
        <h3>State Management Comparison</h3>
        <p>Choose a state management solution to see it in action:</p>
      </header>
      
      <div className="store-grid">
        {storeTypes.map(storeType => (
          <StoreInfo
            key={storeType}
            storeType={storeType}
            isActive={currentStore === storeType}
            onSelect={() => onStoreChange(storeType)}
          />
        ))}
      </div>
      
      <footer className="selector-footer">
        <p className="current-store-notice">
          Currently using: <strong>{STORE_CONFIGS[currentStore].name}</strong>
        </p>
        <p className="comparison-note">
          💡 Switch between stores to see how they handle the same state and actions differently.
          Your drawings will be preserved when switching!
        </p>
      </footer>
    </div>
  )
}

export default StoreSelector