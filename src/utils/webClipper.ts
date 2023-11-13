import { isProbablyReaderable, Readability } from '@mozilla/readability';
import { fetchPageContentSrr } from './fetchPageContentSrr';
import {
  CreateDocumentDTO,
  DocumentMediaType,
} from '../stores/types/document.types';

const parseHtmlTags = (document: Document) => {
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
    const name = tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (name && content)
      tags.push({
        name: tag.getAttribute('property') as string,
        content: tag.getAttribute('content') as string,
      });
  });
  articleTags.forEach((tag) => {
    const name = tag.getAttribute('property');
    const content = tag.getAttribute('content');
    if (name && content)
      tags.push({
        name: tag.getAttribute('property') as string,
        content: tag.getAttribute('content') as string,
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
          mediaType: 'image' as DocumentMediaType,
          src: mainMediaImage,
          html: `<img src="${mainMediaImage}"  alt=""/>`, // TODO: add alt
        }
      : mainMediaVideo
      ? {
          mediaType: 'video' as DocumentMediaType,
          src: mainMediaVideo,
          html: `<video src="${mainMediaVideo}" />`,
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
> => {
  const reader = new Readability(document, {});
  const article = reader.parse();
  const parsedTags = parseHtmlTags(document);
  if (!article) {
    throw new Error('Could not parse article');
  }
  return {
    content: article.content,
    title: article.title,
    summary: article.excerpt,
    url: url || parsedTags.url || '',
    author: parsedTags.author || '',
    authorUrl: parsedTags.authorUrl,
    urlWebsiteName: article.siteName || parsedTags.urlWebsiteName,
    mainMedia: parsedTags.mainMedia || undefined,
  };
};

const getDOMFromURL = async (
  url: string,
): Promise<{
  document: Document;
  url: string;
}> => {
  try {
    const pageContent = await fetchPageContentSrr(url);
    const deserializedDocument = new DOMParser().parseFromString(
      pageContent,
      'text/html',
    );
    return {
      document: deserializedDocument,
      url: url,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const isUrlClipable = async (url: string): Promise<boolean> => {
  const document = await getDOMFromURL(url);
  return isProbablyReaderable(document.document);
};

export const getClippedPageFromUrl = async (
  url: string,
): Promise<
  Pick<
    CreateDocumentDTO,
    | 'content'
    | 'title'
    | 'summary'
    | 'url'
    | 'author'
    | 'authorUrl'
    | 'urlWebsiteName'
    | 'mainMedia'
  >
> => {
  const deserializedDocument = await getDOMFromURL(url);
  return parseDocument(deserializedDocument.document, deserializedDocument.url);
};
