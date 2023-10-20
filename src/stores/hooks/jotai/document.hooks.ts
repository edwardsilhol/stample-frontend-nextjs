'use client';

import { atom, useAtom } from 'jotai';

const searchDocumentsQueryAtom = atom<string | null>(null);
export const useSearchDocumentsQuery = () => useAtom(searchDocumentsQueryAtom);

const currentlyViewedDocumentIdAtom = atom<string | null>(null);
export const useCurrentlyViewedDocumentId = () =>
  useAtom(currentlyViewedDocumentIdAtom);
