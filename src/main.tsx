import React from 'react'
import {createRoot} from 'react-dom/client'
import { ThemeProvider } from 'styled-components'


import App from './App.tsx'
import './index.css'
import theme from './theme.ts'


const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
