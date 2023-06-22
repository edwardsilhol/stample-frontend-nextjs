import {
  getCurrentlyDisplayedDOMUrl,
  isDocumentClippable,
} from '@src/helpers/clipper.helpers';
import { useQuery } from '@tanstack/react-query';

export const useCurrentPageUrl = () =>
  useQuery(['current-page-url'], getCurrentlyDisplayedDOMUrl);

export const useIsDocumentClippable = () =>
  useQuery(['is-document-clippable'], isDocumentClippable);
