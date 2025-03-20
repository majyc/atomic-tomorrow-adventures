import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AtomicTomorrowApp from './AtomicTomorrowApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AtomicTomorrowApp />
  </StrictMode>,
)
