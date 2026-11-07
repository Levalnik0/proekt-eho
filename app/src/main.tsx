import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './theme.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';

// Новая версия подхватывается сама и проверяется раз в час. Иначе после
// публикации человек видел бы старую версию из кэша до следующего запуска.
registerSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) setInterval(() => registration.update(), 60 * 60 * 1000);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
