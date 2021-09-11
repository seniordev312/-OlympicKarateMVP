import React, {createContext, FC} from 'react';
import {makeTranslate} from './makeTranslate';
import translations from './translations.json';
import {DefaultProps, Translate} from './types';

type TranslateContext = {
  t: Translate;
};

export const translateContext = createContext<TranslateContext>({
  t: key => {},
});

export const TranslateContextProvider: FC<DefaultProps> = ({
  language,
  children,
}) => {
  const t = makeTranslate(language, translations);

  return (
    <translateContext.Provider value={{t}}>
      {children}
    </translateContext.Provider>
  );
};
