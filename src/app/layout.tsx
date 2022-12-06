import '../styles/globals.css';
import FontProvider from './fontProvider';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body>
        <FontProvider>{children}</FontProvider>
      </body>
    </html>
  );
}

export default RootLayout;
