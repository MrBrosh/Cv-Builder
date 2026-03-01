import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { CVProvider } from './context/CVContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CVProvider>
        <App />
        <Toaster position="top-right" richColors expand={false} />
      </CVProvider>
    </AuthProvider>
  </StrictMode>,
)
