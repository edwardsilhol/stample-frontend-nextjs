import { atom, useAtom } from 'jotai';
import { User } from 'stores/types/user.types';

const loggedInUserAtom = atom<User | null>(null);
export const useLoggedInUser = () => useAtom(loggedInUserAtom);
