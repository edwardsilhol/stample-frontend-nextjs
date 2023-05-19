import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { CreateDocumentDTO } from '@src/stores/types/document.types';
import { getActiveBrowserTab, runScriptOnTab } from '@src/utils/browser';
const parseTags = (
  document: Document,
): Pick<
  CreateDocumentDTO,
  'author' | 'authorUrl' | 'urlWebsiteName' | 'mainMedia' | 'url'
> => {
  const ogTags = document.querySelectorAll("meta[property^='og:']");
  const articleTags = document.querySelectorAll("meta[property^='article:']");
  const authorTag = document
    .querySelector("meta[name='author']")
    ?.getAttribute('content');
  const tags: {
    name: string;
    content: string;
  }[] = [];
  ogTags.forEach((tag) => {
    tags.push({
      name: tag.getAttribute('property'),
      content: tag.getAttribute('content'),
    });
  });
  articleTags.forEach((tag) => {
    tags.push({
      name: tag.getAttribute('property'),
      content: tag.getAttribute('content'),
    });
  });

  const author =
    tags.find((tag) => tag.name === 'og:article:author' && !!tag.content)
      ?.content || authorTag;
  const authorUrl = tags.find(
    (tag) => tag.name === 'article:author' && !!tag.content,
  )?.content;
  const urlWebsiteName = tags.find(
    (tag) => tag.name === 'og:site_name' && !!tag.content,
  )?.content;
  const mainMediaImage = tags.find(
    (tag) => tag.name === 'og:image' && !!tag.content,
  )?.content;
  const mainMediaVideo = tags.find(
    (tag) => tag.name === 'og:video' && !!tag.content,
  )?.content;

  const url = tags.find((tag) => tag.name === 'og:url' && !!tag.content);
  return {
    author: author,
    authorUrl: authorUrl,
    urlWebsiteName: urlWebsiteName,
    mainMedia: mainMediaImage
      ? {
          mediaType: 'image',
          src: mainMediaImage,
        }
      : mainMediaVideo
      ? {
          mediaType: 'video',
          src: mainMediaVideo,
        }
      : null,
    url: url?.content,
  };
};
const parseDocument = (
  document: Document,
  url: string,
): Pick<
  CreateDocumentDTO,
  | 'content'
  | 'title'
  | 'summary'
  | 'url'
  | 'author'
  | 'authorUrl'
  | 'urlWebsiteName'
  | 'mainMedia'
> | null => {
  const reader = new Readability(document);
  const article = reader.parse();
  const parsedTags = parseTags(document);
  if (!article) {
    return null;
  }
  return {
    content: article.content,
    title: article.title,
    summary: article.excerpt,
    url: parsedTags.url || url,
    author: parsedTags.author,
    authorUrl: parsedTags.authorUrl,
    urlWebsiteName: article.siteName || parsedTags.urlWebsiteName,
    mainMedia: parsedTags.mainMedia,
  };
};

export const isDocumentClippable = async (): Promise<boolean> => {
  const document = await getCurrentlyDisplayedDOM();
  console.log('document', document);
  return isProbablyReaderable(document.document);
};

const getPageContent = () => {
  return {
    url: document.URL,
    document: new XMLSerializer().serializeToString(document),
  };
};

const getCurrentlyDisplayedDOM = async (): Promise<{
  document: Document;
  url: string;
}> => {
  const activeTab = await getActiveBrowserTab();
  try {
    const result = await runScriptOnTab(activeTab, getPageContent);
    const deserializedDocument = new DOMParser().parseFromString(
      result.document,
      'text/html',
    );
    return {
      document: deserializedDocument,
      url: activeTab.url,
    };
  } catch (error) {
    console.log('error', error);
    return {
      document: document,
      url: activeTab.url,
    };
  }
};

export const getCurrentlyDisplayedDOMUrl = async (): Promise<
  string | undefined
> => {
  const tab = await getActiveBrowserTab();
  return tab.url;
};

export const getClippedPage = async (): Promise<Pick<
  CreateDocumentDTO,
  | 'content'
  | 'title'
  | 'summary'
  | 'url'
  | 'author'
  | 'authorUrl'
  | 'urlWebsiteName'
  | 'mainMedia'
> | null> => {
  const deserializedDocument = await getCurrentlyDisplayedDOM();
  return parseDocument(deserializedDocument.document, deserializedDocument.url);
};
