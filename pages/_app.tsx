import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Roboto } from '@next/font/google';

const font = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
