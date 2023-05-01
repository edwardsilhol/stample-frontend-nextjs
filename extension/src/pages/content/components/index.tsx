import { createRoot } from 'react-dom/client';
import App from '@src/pages/content/components/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { AppProvider } from '@src/pages/providers/GuestProvider';

refreshOnUpdate('pages/content');
const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';
document.body.append(root);

createRoot(root).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
