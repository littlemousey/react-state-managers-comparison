/**
 * Redux Provider Component
 * 
 * This component provides the Redux store to the React component tree.
 * It wraps the application (or parts of it) to enable Redux state management.
 */

import React from 'react'
import { Provider } from 'react-redux'
import { reduxStore } from './reduxStore'

interface ReduxProviderProps {
  children: React.ReactNode
}

/**
 * Redux Provider wrapper component
 * Provides the Redux store to all child components
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={reduxStore}>
      {children}
    </Provider>
  )
}