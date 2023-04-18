import { atom, useAtom } from 'jotai';

const selectedOrganisationIdAtom = atom<string | null>(null);
export const useSelectedOrganisationId = () =>
  useAtom(selectedOrganisationIdAtom);
