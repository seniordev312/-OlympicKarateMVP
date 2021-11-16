export enum Routes {
  LOGIN = '/login',
  REGISTER = '/register',
  LECTIONS = '/courses/:id/lections',
  LECTION = 'lection',
  LIKE = '/like',
  USER = '/user',
  CHAT = '/chat',
  SETTINGS = '/settings',
  LEARN = '/learn',
  LECTION_PROGRESS = '/progress/:userId/lection',
}

const NAVBAR_VISIBILITY_MAP = {
  learn: true,
  chat: true,
  settings: true,
};

export const getTabBarVisibility = (route: string) => {
  const isVisible = route in NAVBAR_VISIBILITY_MAP ? true : false;

  return isVisible;
};
