import { ReactNode } from 'react';
import { Roboto } from '@next/font/google';

const font = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

function FontProvider({ children }: { children: ReactNode }) {
  return <main className={font.className}>{children}</main>;
}

export default FontProvider;
