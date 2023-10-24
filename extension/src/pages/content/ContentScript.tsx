import {
  injectAlreadyPresentStamples,
  injectStampleTabTitle,
  parseGoogleResults,
} from '@src/helpers/content.helpers';
import { useSearchDocumentsUrlsByUrls } from '@src/stores/hooks/tanstackQuery/document.hooks';
import { useSession } from '@src/stores/hooks/tanstackQuery/user.hooks';
import { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@src/pages/providers/AppProvider';

const ContentScript = () => {
  const { searchElements }: ReturnType<typeof parseGoogleResults> = useMemo(
    () => parseGoogleResults(document),
    [document.URL],
  );
  const { data: matchingUrls } = useSearchDocumentsUrlsByUrls(
    searchElements.map((element) => element.url),
  );

  useEffect(() => {
    injectStampleTabTitle(document);
  }, []);
  useEffect(() => {
    injectAlreadyPresentStamples(
      searchElements,
      matchingUrls?.map((document) => document.url) ?? [],
    );
  }, [matchingUrls]);

  return null;
};

const ContentScriptPage = () => {
  const { data: user } = useSession();
  if (!user) {
    return null;
  }
  return <ContentScript />;
};

const root = document.createElement('div');
root.id = 'chrome-extension-stample-content-script-root';
document.body.append(root);

createRoot(root).render(
  <AppProvider>
    <ContentScriptPage />
  </AppProvider>,
);
