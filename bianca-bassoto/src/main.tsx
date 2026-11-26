import { hydrateRoot, createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { iniciarMovimento } from './motion';

const root = document.getElementById('root')!;
if (import.meta.env.DEV && !document.getElementById('bb-logo'))
  import('./components/logoDefs').then((m) => document.body.insertAdjacentHTML('afterbegin', m.logoDefsHtml()));
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);

(window as unknown as { __bbReady: boolean }).__bbReady = true;
iniciarMovimento();
