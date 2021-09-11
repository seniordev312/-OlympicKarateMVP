import {Caption} from './caption';
import {Question} from './qa';

export type Timing = {
  time: string;
};

export type Lection = {
  courseId: string;
  id: string;
  title: string;
  url: string;
  category: string;
  order: string;
  duration: string;
  captions: Caption[];
  questions: Question[];
  lectionNo: number;
  isLocked?: boolean;
  positiveMessages?: Array<string>;
  negativeMessages?: Array<string>;
  timings: Timing[];
};

export type LectionProgress = {
  lectionWatched: boolean;
  questionAnsweredCorrect: boolean;
};
export type LearningProgress = {
  userId?: string;
  likedLections: string[];
  currentLection: string;
  lectionProgress?: LectionProgress;
};

export type LearningProgressData = {
  likedLections: Lection[];
  currentLection: string;
};

/**
 * This enum contains all possible states in which an user can be regarding to lection progress
 *
 * NOT_COMPLETED - Watched lection ❌ Questions Answered ❌
 * NOT_PASSED    - Watched lection ✅ Questions Answered ❌
 * PASSED        - Watched lection ✅ Questions Answered ✅
 */
export enum LectionProgressState {
  NOT_COMPLETED = 'NOT_COMPLETED',
  NOT_PASSED = 'NOT_PASSED',
  PASSED = 'PASSED',
}
