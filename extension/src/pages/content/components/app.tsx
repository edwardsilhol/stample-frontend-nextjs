import {
  injectAlreadyPresentStamples,
  injectStampleTabTitle,
  parseGoogleResults,
} from '@src/helpers/content.helpers';
import { useSearchDocuments } from '@src/stores/hooks/document.hooks';
import { useSession } from '@src/stores/hooks/user.hooks';
import { useEffect, useMemo } from 'react';

export default function App() {
  useSession();
  const { searchElements }: ReturnType<typeof parseGoogleResults> = useMemo(
    () => parseGoogleResults(document),
    [document.URL],
  );
  const { data: documents } = useSearchDocuments({
    url: searchElements.map((element) => element.url),
  });
  useEffect(() => {
    injectAlreadyPresentStamples(
      searchElements,
      documents?.map((document) => document.url) || [],
    );
  }, [documents]);

  useEffect(() => {
    injectStampleTabTitle(document);
  }, []);
}
