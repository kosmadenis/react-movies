import React from 'react'
import ReactDOM from 'react-dom/client'

import './global.css'

import App from './components/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No root element')
}

const root = ReactDOM.createRoot(rootElement)

root.render(React.createElement(App))
