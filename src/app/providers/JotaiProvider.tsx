'use client';
import { Provider } from 'jotai';
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}
function JotaiProvider({ children }: Props) {
  return <Provider>{children}</Provider>;
}
export default JotaiProvider;
