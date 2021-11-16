import {Lection} from './lection';

export type Course = {
  id: string;
  title: string;
  description: string;
  courseLogo: string;
  lections: Lection[];
};
