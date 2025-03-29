import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from "./store/store.js"
import { SnackbarProvider } from './context/SnackbarContext'

createRoot(document.getElementById('root')).render(
  // Wrap the App component with BrowserRouter to enable routing
  <BrowserRouter>
    {/* // The Provider component is a wrapper around the App component. 
    // It provides the store to the App component. */}
    <Provider store={store}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>
);
