import { useTranslation as useAppTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, ...rest } = useAppTranslation();
  return {
    t: (key: string, params?: any) => t(key, params).toString(),
    ...rest,
  };
};
