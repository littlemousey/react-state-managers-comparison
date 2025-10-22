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
// Store Button Component
// ============================================================================

interface StoreButtonProps {
  storeType: StoreType
  isActive: boolean
  onSelect: () => void
}

const StoreButton: React.FC<StoreButtonProps> = ({ storeType, isActive, onSelect }) => {
  const config = STORE_CONFIGS[storeType]
  
  return (
    <button
      className={`store-button ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      aria-pressed={isActive}
      title={`Switch to ${config.name}`}
    >
      {config.name}
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
      <div className="selector-content">
        <span className="selector-label">State Manager:</span>
        <div className="store-buttons">
          {storeTypes.map(storeType => (
            <StoreButton
              key={storeType}
              storeType={storeType}
              isActive={currentStore === storeType}
              onSelect={() => onStoreChange(storeType)}
            />
          ))}
        </div>
        <span className="current-store">
          {STORE_CONFIGS[currentStore].name}
        </span>
      </div>
    </div>
  )
}

export default StoreSelector