import React, { useState } from 'react'
import { useCanvasStoreWithType } from '../hooks/useCanvasStoreHooks'
import './InfoPanel.css'

/**
 * InfoPanel Component
 * 
 * Provides comprehensive comparison of the three state management approaches
 * with detailed trade-offs, performance characteristics, and recommendations.
 */

interface ComparisonData {
  name: string
  description: string
  pros: string[]
  cons: string[]
  bundleSize: string
  complexity: 'Low' | 'Medium' | 'High'
  performance: 'Excellent' | 'Good' | 'Fair'
  ecosystem: 'Large' | 'Medium' | 'Small'
  learningCurve: 'Easy' | 'Moderate' | 'Steep'
  bestFor: string[]
  worstFor: string[]
}

const COMPARISON_DATA: Record<string, ComparisonData> = {
  zustand: {
    name: 'Zustand',
    description: 'A small, fast, and scalable state management solution with minimal boilerplate.',
    pros: [
      'Minimal boilerplate code',
      'Excellent TypeScript support',
      'Built-in performance optimizations',
      'Simple, intuitive API',
      'Small bundle size',
      'No providers needed'
    ],
    cons: [
      'Smaller ecosystem than Redux',
      'Less tooling support',
      'Newer library with evolving patterns',
      'Limited debugging tools compared to Redux'
    ],
    bundleSize: '2.8KB gzipped',
    complexity: 'Low',
    performance: 'Excellent',
    ecosystem: 'Medium',
    learningCurve: 'Easy',
    bestFor: [
      'Small to medium applications',
      'Rapid prototyping',
      'Projects needing minimal setup',
      'Performance-critical applications'
    ],
    worstFor: [
      'Large teams needing strict patterns',
      'Complex applications requiring extensive debugging',
      'Projects requiring extensive middleware'
    ]
  },
  redux: {
    name: 'Redux Toolkit',
    description: 'The modern Redux approach with reduced boilerplate and excellent developer tools.',
    pros: [
      'Mature ecosystem with extensive tooling',
      'Excellent debugging with Redux DevTools',
      'Predictable state updates',
      'Great for large, complex applications',
      'Strong community support',
      'Time-travel debugging'
    ],
    cons: [
      'More boilerplate than other solutions',
      'Steeper learning curve',
      'Requires additional setup',
      'Larger bundle size'
    ],
    bundleSize: '12.4KB gzipped',
    complexity: 'High',
    performance: 'Good',
    ecosystem: 'Large',
    learningCurve: 'Steep',
    bestFor: [
      'Large, complex applications',
      'Teams needing strict patterns',
      'Applications requiring extensive debugging',
      'Projects with complex async logic'
    ],
    worstFor: [
      'Simple applications',
      'Rapid prototyping',
      'Projects with tight bundle size requirements',
      'Beginner React developers'
    ]
  },
  context: {
    name: 'React Context API',
    description: 'Built-in React state management using Context and useReducer for component tree state.',
    pros: [
      'No additional dependencies',
      'Built into React core',
      'Perfect for component-tree state',
      'Simple mental model',
      'Zero bundle size overhead',
      'Familiar to React developers'
    ],
    cons: [
      'Can cause unnecessary re-renders',
      'Verbose for complex state logic',
      'Limited debugging tools',
      'Performance issues with frequent updates',
      'Requires careful optimization'
    ],
    bundleSize: '0KB (built-in)',
    complexity: 'Medium',
    performance: 'Fair',
    ecosystem: 'Large',
    learningCurve: 'Moderate',
    bestFor: [
      'Component-scoped state',
      'Theme/settings management',
      'Simple global state',
      'Projects avoiding external dependencies'
    ],
    worstFor: [
      'Frequently updating state',
      'Complex state logic',
      'Performance-critical applications',
      'Large-scale state management'
    ]
  }
}

// ============================================================================
// Components
// ============================================================================

interface MetricBarProps {
  label: string
  value: string
  level: 'Low' | 'Medium' | 'High' | 'Easy' | 'Moderate' | 'Steep' | 'Excellent' | 'Good' | 'Fair' | 'Large' | 'Small'
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, level }) => {
  const getBarWidth = () => {
    switch (level) {
      case 'Low':
      case 'Easy':
      case 'Small':
        return '33%'
      case 'Medium':
      case 'Moderate':
      case 'Good':
        return '66%'
      case 'High':
      case 'Steep':
      case 'Large':
      case 'Excellent':
        return '100%'
      case 'Fair':
        return '50%'
      default:
        return '50%'
    }
  }

  const getBarColor = () => {
    switch (level) {
      case 'Excellent':
        return '#28a745'
      case 'Good':
        return '#17a2b8'
      case 'Fair':
        return '#ffc107'
      case 'Low':
      case 'Easy':
      case 'Small':
        return '#28a745'
      case 'Medium':
      case 'Moderate':
        return '#17a2b8'
      case 'High':
      case 'Steep':
      case 'Large':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  return (
    <div className="metric-bar">
      <div className="metric-label">
        <span>{label}:</span>
        <span className="metric-value">{value}</span>
      </div>
      <div className="bar-container">
        <div 
          className="bar-fill" 
          style={{ 
            width: getBarWidth(), 
            backgroundColor: getBarColor() 
          }}
        />
      </div>
    </div>
  )
}

interface ComparisonCardProps {
  data: ComparisonData
  isActive: boolean
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ data, isActive }) => (
  <div className={`comparison-card ${isActive ? 'active' : ''}`}>
    <div className="card-header">
      <h3>{data.name}</h3>
      <div className="bundle-size">{data.bundleSize}</div>
    </div>
    
    <p className="description">{data.description}</p>
    
    <div className="metrics-section">
      <h4>📊 Metrics</h4>
      <MetricBar label="Complexity" value={data.complexity} level={data.complexity} />
      <MetricBar label="Performance" value={data.performance} level={data.performance} />
      <MetricBar label="Learning Curve" value={data.learningCurve} level={data.learningCurve} />
      <MetricBar label="Ecosystem" value={data.ecosystem} level={data.ecosystem} />
    </div>
    
    <div className="pros-cons">
      <div className="pros-section">
        <h4>✅ Pros</h4>
        <ul>
          {data.pros.map((pro, index) => (
            <li key={index}>{pro}</li>
          ))}
        </ul>
      </div>
      
      <div className="cons-section">
        <h4>❌ Cons</h4>
        <ul>
          {data.cons.map((con, index) => (
            <li key={index}>{con}</li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="recommendations">
      <div className="best-for">
        <h4>🎯 Best For</h4>
        <ul>
          {data.bestFor.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      
      <div className="worst-for">
        <h4>⚠️ Not Ideal For</h4>
        <ul>
          {data.worstFor.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

// ============================================================================
// Main Component
// ============================================================================

const InfoPanel: React.FC = () => {
  const { storeType } = useCanvasStoreWithType()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'comparison' | 'recommendations'>('overview')

  const currentStore = COMPARISON_DATA[storeType]

  return (
    <div className="info-panel">
      <div className="panel-header">
        <h2>🔍 State Management Guide</h2>
        <div className="current-store">
          Currently using: <strong>{currentStore?.name}</strong>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${selectedTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setSelectedTab('comparison')}
        >
          Comparison
        </button>
        <button 
          className={`tab ${selectedTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setSelectedTab('recommendations')}
        >
          Recommendations
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === 'overview' && (
          <div className="overview-tab">
            <h3>Current Implementation: {currentStore?.name}</h3>
            <ComparisonCard data={currentStore} isActive={true} />
          </div>
        )}

        {selectedTab === 'comparison' && (
          <div className="comparison-tab">
            <h3>Side-by-Side Comparison</h3>
            <div className="comparison-grid">
              {Object.entries(COMPARISON_DATA).map(([key, data]) => (
                <ComparisonCard 
                  key={key} 
                  data={data} 
                  isActive={key === storeType}
                />
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'recommendations' && (
          <div className="recommendations-tab">
            <h3>🎯 When to Use Each Solution</h3>
            
            <div className="recommendation-section">
              <h4>🚀 Starting a New Project?</h4>
              <div className="recommendation-grid">
                <div className="recommendation-card">
                  <h5>Small to Medium Apps</h5>
                  <p><strong>Choose Zustand</strong> - Minimal setup, great performance, easy to learn.</p>
                </div>
                <div className="recommendation-card">
                  <h5>Large Complex Apps</h5>
                  <p><strong>Choose Redux Toolkit</strong> - Mature ecosystem, excellent debugging, predictable patterns.</p>
                </div>
                <div className="recommendation-card">
                  <h5>Simple Global State</h5>
                  <p><strong>Choose Context API</strong> - No dependencies, familiar to React developers.</p>
                </div>
              </div>
            </div>

            <div className="recommendation-section">
              <h4>📊 Performance Considerations</h4>
              <div className="performance-comparison">
                <div className="perf-item">
                  <span className="perf-label">Frequent Updates:</span>
                  <span className="perf-winner">Zustand {'>'} Redux Toolkit {'>'} Context API</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Bundle Size:</span>
                  <span className="perf-winner">Context API {'>'} Zustand {'>'} Redux Toolkit</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Developer Experience:</span>
                  <span className="perf-winner">Redux Toolkit {'>'} Zustand {'>'} Context API</span>
                </div>
              </div>
            </div>

            <div className="recommendation-section">
              <h4>🔧 Migration Strategy</h4>
              <p>This project demonstrates how to abstract state management for easier migration:</p>
              <ul>
                <li>Use a <strong>universal adapter pattern</strong> to isolate state management logic</li>
                <li>Keep components <strong>store-agnostic</strong> using consistent interfaces</li>
                <li>Implement <strong>gradual migration</strong> by switching stores per feature</li>
                <li>Test each implementation with the <strong>same use cases</strong> for fair comparison</li>
              </ul>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}

export default InfoPanel