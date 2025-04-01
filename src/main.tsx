
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the root element and ensure it exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create the root and render the app
createRoot(rootElement).render(<App />);
