import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: {
    documentId: string;
    teamId: string;
  };
}

// TODO: fix this

// export async function generateMetadata({ params: { documentId } }: Props) {
//   const document = await ssrFetch<Document>({
//     endpoint: `/document/${documentId}`,
//   });
//
//   return {
//     title: document?.title || 'Stample',
//     description: document?.content,
//     openGraph: {
//       title: document?.title || 'Stample',
//       description: document?.content,
//       type: 'article',
//       images: [
//         {
//           url: document?.mainMedia?.src || '', // TODO: add default image
//           alt: 'Stample',
//         },
//       ],
//     },
//   };
// }

function DocumentLayout({ children }: Props) {
  return <>{children}</>;
}

export default DocumentLayout;
