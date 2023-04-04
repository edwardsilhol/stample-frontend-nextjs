import { atom, useAtom } from 'jotai';

const isSidebarOpen = atom(false);
export const useIsSidebarOpen = () => useAtom(isSidebarOpen);
