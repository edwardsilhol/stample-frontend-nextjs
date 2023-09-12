import { ReactNode } from 'react';
import { Roboto } from '@next/font/google';

const font = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});
interface Props {
  children: ReactNode;
}

function FontProvider({ children }: Props) {
  return (
    <main className={font.className} style={{ height: '100%' }}>
      {children}
    </main>
  );
}

export default FontProvider;
