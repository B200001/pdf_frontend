import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.scss';
import { UserProvider } from './context/UserContext.tsx';
// import ResponsiveAppBar from "./components/ResponsiveAppBar.tsx"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        {/* <ResponsiveAppBar/> */}
        <App />
      </BrowserRouter>
    </UserProvider>


  </StrictMode>,
)
