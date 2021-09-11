import {Language, Translate} from './types';

type MakeTranslate = (
  language: Language,
  translations: Record<string, any>,
) => Translate;

export const makeTranslate: MakeTranslate = (
  language: Language,
  translations: Record<string, any>,
) => {
  return (key: string) => {
    try {
      return translations[language][key];
    } catch (err) {
      console.error('An error occured while translating');
      console.error(err);
      return '';
    }
  };
};
