import { AlreadyPresentStampleIcon } from '@src/components/content/AlreadyPresentStampleIcon';
import { StampleTabTitle } from '@src/components/content/StampleTabTitle';
import { createRoot } from 'react-dom/client';
import {
  GOOGLE_CONTENT_ID,
  GOOGLE_RESULT_STATS_ID,
  GOOGLE_TAB_BAR_CONTAINER_JS_CONTROLLER_ATTRIBUTE,
  GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME,
  GOOGLE_TAB_BAR_ITEM_STANDARD_ACTIVE_CSS_CLASSNAMES,
  GOOGLE_TAB_BAR_ITEM_SUGGESTION_ACTIVE_CSS_CLASSNAMES,
  GOOGLE_TAB_BAR_ITEM_SUGGESTION_TEXT_CSS_CLASSNAME_TO_REMOVE,
  STAMPLE_TAB_CONTENT_ID,
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
  console.log('searchElements', searchElements.length);
  searchElements.forEach((element) => {
    const href = element.url;
    console.log('href', href, stamplesUrls);
    if (stamplesUrls.includes(href)) {
      console.log('already present', href);
      const container = getInjectableContainer(element);
      container.setAttribute(
        'style',
        'width: 100%; display: flex; align-items: baseline;',
      );
      const alreadyPresentStampleIcon = document.createElement('div');
      container.append(alreadyPresentStampleIcon);

      console.log('alreadyPresentStampleIcon', alreadyPresentStampleIcon);
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

const findSuggestionSelectedTabBarItem = (document: Document) => {
  const tabBarItems = document.getElementsByClassName(
    `${GOOGLE_TAB_BAR_ITEM_SUGGESTION_ACTIVE_CSS_CLASSNAMES.join(
      ' ',
    )} ${GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME}`,
  );
  if (!tabBarItems) {
    return;
  }
  return tabBarItems[0];
};

const findStandardSelectedTabBarItem = (document: Document) => {
  const tabBarItems = document.getElementsByClassName(
    `${GOOGLE_TAB_BAR_ITEM_STANDARD_ACTIVE_CSS_CLASSNAMES.join(
      ' ',
    )} ${GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME}`,
  );
  if (!tabBarItems) {
    return;
  }
  return tabBarItems[0];
};

export const findStampleTabBarItem = (document: Document) => {
  const stampleTabBarItem = document.getElementById(STAMPLE_TAB_TITLE_ID);
  return stampleTabBarItem;
};

const treatSuggestionTabBarItemBeforeInjection = (
  selectedTabBarItem: Element,
) => {
  selectedTabBarItem.classList.remove(
    ...GOOGLE_TAB_BAR_ITEM_SUGGESTION_TEXT_CSS_CLASSNAME_TO_REMOVE,
  );
};

const findSelectedTabBarItem = (
  document: Document,
): {
  element: Element;
  isSuggestion: boolean;
} | null => {
  const suggestionSelectedTabBarItem =
    findSuggestionSelectedTabBarItem(document);
  const standardSelectedTabBarItem = findStandardSelectedTabBarItem(document);
  if (!!suggestionSelectedTabBarItem) {
    return {
      element: suggestionSelectedTabBarItem,
      isSuggestion: true,
    };
  } else if (!!standardSelectedTabBarItem) {
    return {
      element: standardSelectedTabBarItem,
      isSuggestion: false,
    };
  } else {
    return null;
  }
};

const treatTabBarItemBeforeInjection = (
  selectedTabBarItem: Element,
  isSuggestion: boolean,
) => {
  if (isSuggestion) {
    treatSuggestionTabBarItemBeforeInjection(selectedTabBarItem);
  }
};

export const injectStampleTabTitle = (document: Document) => {
  // const container = document.querySelectorAll(
  //   `[jscontroller="${GOOGLE_TAB_BAR_CONTAINER_JS_CONTROLLER_ATTRIBUTE}"]`,
  // )[0];
  // const stampleTabTitle = document.createElement('a');
  // const selectedTabBarItem = findSelectedTabBarItem(document);
  // // if (selectedTabBarItem) {
  // //   treatTabBarItemBeforeInjection(
  // //     selectedTabBarItem.element,
  // //     selectedTabBarItem.isSuggestion,
  // //   );
  // // }
  // let firstNonSelectedTabBarItem =
  //   !!selectedTabBarItem && container.childNodes.length > 2
  //     ? container.childNodes[2]
  //     : container.childNodes[0];
  // container.insertBefore(stampleTabTitle, firstNonSelectedTabBarItem);
  // stampleTabTitle.id = STAMPLE_TAB_TITLE_ID;
  // stampleTabTitle.className = GOOGLE_TAB_BAR_ITEM_CSS_CLASSNAME;
  // createRoot(stampleTabTitle).render(<StampleTabTitle />);
};
const hideOrShowResultsStats = (document: Document, show: boolean) => {
  const resultsStats = document.getElementById(GOOGLE_RESULT_STATS_ID);

  if (!show) {
    resultsStats?.setAttribute('style', 'display: none;');
  } else {
    resultsStats?.setAttribute('style', 'display: inherit;');
  }
};
export const selectStampleTab = (document: Document) => {
  const selectedTabBarItem = findSelectedTabBarItem(document);
  if (selectedTabBarItem) {
    if (selectedTabBarItem.isSuggestion) {
      selectedTabBarItem.element.classList.remove(
        ...GOOGLE_TAB_BAR_ITEM_SUGGESTION_ACTIVE_CSS_CLASSNAMES,
      );
    } else {
      selectedTabBarItem.element.classList.remove(
        ...GOOGLE_TAB_BAR_ITEM_STANDARD_ACTIVE_CSS_CLASSNAMES,
      );
    }
  }
  const stampleTabBarItem = findStampleTabBarItem(document);
  if (selectedTabBarItem?.isSuggestion || !selectedTabBarItem) {
    stampleTabBarItem?.classList.add(
      ...GOOGLE_TAB_BAR_ITEM_SUGGESTION_ACTIVE_CSS_CLASSNAMES,
    );
  } else {
    stampleTabBarItem?.classList.add(
      ...GOOGLE_TAB_BAR_ITEM_STANDARD_ACTIVE_CSS_CLASSNAMES,
    );
  }
  injectStampleTabContent(document);
  hideOrShowResultsStats(document, false);
};

export const unselectStampleTab = (document: Document) => {
  const stampleTabBarItem = findStampleTabBarItem(document);
  if (!stampleTabBarItem) {
    return;
  }
  stampleTabBarItem.classList.remove(
    ...GOOGLE_TAB_BAR_ITEM_SUGGESTION_ACTIVE_CSS_CLASSNAMES,
    ...GOOGLE_TAB_BAR_ITEM_STANDARD_ACTIVE_CSS_CLASSNAMES,
  );
  disableStampleTabContent(document);
  hideOrShowResultsStats(document, true);
};

const injectStampleTabContent = (document: Document) => {
  const container = document.getElementById(GOOGLE_CONTENT_ID);

  container.setAttribute('style', 'display: none;');

  const stampleTabContent = document.createElement('div');
  container.parentNode.insertBefore(stampleTabContent, container.nextSibling);
  stampleTabContent.id = STAMPLE_TAB_CONTENT_ID;
  stampleTabContent.setAttribute('style', ' margin-top: 16px');
  createRoot(stampleTabContent).render(
    <AppProvider>
      <DocumentsView />
    </AppProvider>,
  );
};

const disableStampleTabContent = (document: Document) => {
  const stampleTabContent = document.getElementById(STAMPLE_TAB_CONTENT_ID);
  stampleTabContent.remove();
  const container = document.getElementById(GOOGLE_CONTENT_ID);
  container.setAttribute('style', 'display: unset;');
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
