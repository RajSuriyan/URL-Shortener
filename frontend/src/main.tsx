import { HeroUIProvider } from '@heroui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <HeroUIProvider>
    <div className=' bg-gray-100 '>
        <App />
    </div>

    </HeroUIProvider>
  </StrictMode>,
)
