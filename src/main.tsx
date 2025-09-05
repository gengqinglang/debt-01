
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PerformanceMonitor } from './components/common/PerformanceMonitor'

createRoot(document.getElementById("root")!).render(
  <PerformanceMonitor>
    <App />
  </PerformanceMonitor>
);
