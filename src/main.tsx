import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/styles/globals.css';
import { App } from '@/app/App';

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root mount element #root was not found.');
}

const appTree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const hasPrerenderedHtml =
  rootEl.innerHTML.trim().length > 0 && !rootEl.innerHTML.includes('<!--ssr-outlet-->');

if (hasPrerenderedHtml) {
  hydrateRoot(rootEl, appTree);
} else {
  createRoot(rootEl).render(appTree);
}

