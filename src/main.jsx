import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { MotionConfig } from 'framer-motion'
import { isNativeApp, isAppViewNow } from './hooks/useAppView'
import { installAuthFetch } from './config/api'

installAuthFetch()

// Inside the Capacitor app, use the app styling at every screen size
if (isNativeApp()) document.documentElement.classList.add('native-app')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Apps don't animate: skip motion on phones and in the native app */}
          <MotionConfig reducedMotion={isAppViewNow() ? 'always' : 'never'}>
            <App />
          </MotionConfig>
        </BrowserRouter>
      </ThemeProvider>
    </SocketProvider>
  </StrictMode>,
)
