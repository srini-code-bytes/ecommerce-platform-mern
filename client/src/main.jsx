import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from "./store/store.js"
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* // The Provider component is a wrapper around the App component. It provides the store to the App component. */}
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
