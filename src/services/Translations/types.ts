export enum Language {
  EN = 'en',
  SR = 'sr',
  DEFAULT = 'en',
}

export type Translate = (key: string) => any;

export type DefaultProps = {
  language: Language;
};
