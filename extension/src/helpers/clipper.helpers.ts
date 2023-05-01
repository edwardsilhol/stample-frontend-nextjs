import { Readability } from '@mozilla/readability';
import { CreateDocumentDTO } from '@src/stores/types/document.types';
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
    author: author || '',
    authorUrl: authorUrl || '',
    urlWebsiteName: urlWebsiteName || '',
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
    url: url?.content || '',
  };
};
const parseDocument = (
  document: Document,
): Pick<
  CreateDocumentDTO,
  | 'content'
  | 'title'
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
    url: parsedTags.url,
    author: parsedTags.author,
    authorUrl: parsedTags.authorUrl,
    urlWebsiteName: article.siteName || parsedTags.urlWebsiteName,
    mainMedia: parsedTags.mainMedia,
  };
};

const getPageContent = () => {
  return {
    url: document.URL,
    document: new XMLSerializer().serializeToString(document),
  };
};
export const getClippedPage = async (): Promise<Pick<
  CreateDocumentDTO,
  | 'content'
  | 'title'
  | 'url'
  | 'author'
  | 'authorUrl'
  | 'urlWebsiteName'
  | 'mainMedia'
> | null> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: getPageContent,
  });
  const deserializedDocument = new DOMParser().parseFromString(
    result[0].result.document,
    'text/html',
  );
  return parseDocument(deserializedDocument);
};
