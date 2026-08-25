import React from 'react'
import ReactDOM from 'react-dom/client'
import Shell from './Shell'
import PasswordGate from './PasswordGate'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PasswordGate>
      <Shell />
    </PasswordGate>
  </React.StrictMode>
)

