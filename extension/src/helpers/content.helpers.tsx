import { AlreadyPresentStampleIcon } from '@src/components/content/AlreadyPresentStampleIcon';
import { StampleTabTitle } from '@src/pages/content/components/StampleTabTitle';
import { createRoot } from 'react-dom/client';
import {
  GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME,
  GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME,
  STAMPLE_TAB_TITLE_ID,
} from '../constants/content';
import { DocumentsView } from '@src/components/content/document/DocumentsView';
import { AppProvider } from '@src/pages/providers/AppProvider';

type SearchElement = {
  link: Element;
  title: HTMLHeadingElement;
  url: string;
};

type SearchTexts = {
  title: string;
  description?: string;
};

const extractTexts = (elements: SearchElement): SearchTexts => {
  const title = elements.title.outerText;
  return {
    title,
  };
};

const getGoogleSearchElements = (document: Document): SearchElement[] => {
  const search = document.getElementsByClassName('g');
  if (!search) {
    return;
  }
  let results: SearchElement[] = [];
  for (let searchItem of search) {
    const item = searchItem.children[0];
    if (!item) {
      continue;
    }
    const link = item?.children[0]?.children[0]?.querySelector('a');
    const title = item?.children[0]?.children[0]?.querySelector('h3');
    if (!link || !title) {
      continue;
    }
    results.push({
      link,
      title,
      url: link.getAttribute('href'),
    });
  }
  return results;
};

const getInjectableContainer = (element: SearchElement) =>
  element.link.parentElement.children[1];

export const injectAlreadyPresentStamples = (
  searchElements: SearchElement[],
  stamplesUrls: string[],
) => {
  if (!searchElements) {
    return;
  }
  searchElements.forEach((element) => {
    const href = element.url;
    if (stamplesUrls.includes(href)) {
      const container = getInjectableContainer(element);
      container.setAttribute(
        'style',
        'width: 100%; display: flex; align-items: baseline;',
      );
      const alreadyPresentStampleIcon = document.createElement('div');
      container.append(alreadyPresentStampleIcon);
      createRoot(alreadyPresentStampleIcon).render(
        <AlreadyPresentStampleIcon />,
      );
    }
  });
};

export const findTabBarItems = (document: Document) => {
  const tabBarItems = document.getElementsByClassName(
    GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME,
  );
  if (!tabBarItems) {
    return;
  }
  return tabBarItems;
};

const findSelectedTabBarItem = (document: Document) => {
  const tabBarItems = document.getElementsByClassName(
    `${GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME} ${GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME}`,
  );
  if (!tabBarItems) {
    return;
  }
  return tabBarItems[0];
};
const findStampleTabBarItem = (document: Document) => {
  const stampleTabBarItem = document.getElementById(STAMPLE_TAB_TITLE_ID);
  return stampleTabBarItem;
};

export const injectStampleTabTitle = (document: Document) => {
  const tabBarItems = findTabBarItems(document);
  const container = tabBarItems[0].parentElement;
  const stampleTabTitle = document.createElement('div');
  container.append(stampleTabTitle);
  stampleTabTitle.id = STAMPLE_TAB_TITLE_ID;
  stampleTabTitle.className = GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME;
  createRoot(stampleTabTitle).render(<StampleTabTitle />);
};

export const selectStampleTab = (document: Document) => {
  const selectedTabBarItem = findSelectedTabBarItem(document);
  if (selectedTabBarItem) {
    const replacedItem = selectedTabBarItem.firstChild.cloneNode(true);
    const replacedItemChildren = replacedItem.childNodes;
    const textContent = replacedItem.textContent;
    const unselectedTabBarItem = document.createElement('a');
    unselectedTabBarItem.append(...replacedItemChildren);
    unselectedTabBarItem.setAttribute('textContent', textContent);
    unselectedTabBarItem.setAttribute('href', new URL(document.URL).href);
    const underline = unselectedTabBarItem.lastElementChild;
    underline?.remove();
    selectedTabBarItem.classList.remove(
      GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME,
    );
    selectedTabBarItem.firstChild.replaceWith(unselectedTabBarItem);
  }
  const stampleTabBarItem = findStampleTabBarItem(document);
  stampleTabBarItem.classList.add(GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME);
};

export const unselectStampleTab = (document: Document) => {
  const stampleTabBarItem = findStampleTabBarItem(document);
  if (!stampleTabBarItem) {
    return;
  }
  stampleTabBarItem.classList.remove(GOOGLE_TAB_BAR_ITEM_ACTIVE_CSS_CLASSNAME);
};

export const injectStampleTabContent = (document: Document) => {
  const container = document.getElementById('rcnt');

  container.replaceChildren();

  const stampleTabContent = document.createElement('div');
  container.replaceWith(stampleTabContent);
  stampleTabContent.id = 'stample-tab-content';
  stampleTabContent.setAttribute('style', "width: 'var(--center-width);'");
  createRoot(stampleTabContent).render(
    <AppProvider>
      <DocumentsView />
    </AppProvider>,
  );
};

export const getGoogleSearchQuery = (document: Document): string => {
  const url = new URL(document.URL);
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get('q');
  return query;
};
export const parseGoogleResults = (
  document: Document,
): {
  searchElements: SearchElement[];
  texts: SearchTexts[];
} => {
  const searchElements = getGoogleSearchElements(document);
  if (!searchElements) {
    return;
  }

  const texts = searchElements.map((element) => extractTexts(element));
  return {
    searchElements,
    texts,
  };
};

export const getImageUrl = (url: string) => chrome.runtime.getURL(url);
