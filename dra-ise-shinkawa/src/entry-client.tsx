import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
const el = document.getElementById('root')!;
if (el.hasChildNodes()) hydrateRoot(el, <App />); else createRoot(el).render(<App />);
