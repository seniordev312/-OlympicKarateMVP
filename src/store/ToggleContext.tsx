import React, {createContext, FC} from 'react';
import {useToggle} from '../utils/hooks';

export type Toggle = {
  state: boolean;
  setOn: () => void;
  setOff: () => void;
  toggle: () => void;
};
export type ToggleContext = {
  togglePressBlockOverlay: Toggle;
  togglePaused: Toggle;
};

const initialState: ToggleContext = {
  togglePressBlockOverlay: {
    state: false,
    setOn: () => ({}),
    setOff: () => ({}),
    toggle: () => ({}),
  },
  togglePaused: {
    state: false,
    setOn: () => ({}),
    setOff: () => ({}),
    toggle: () => ({}),
  },
};

export const ToggleContext = createContext<ToggleContext>(initialState);

export const ToggleContextProvider: FC = ({children}) => {
  const togglePressBlockOverlay: Toggle = useToggle(false);
  const togglePaused: Toggle = useToggle(false);

  return (
    <ToggleContext.Provider value={{togglePressBlockOverlay, togglePaused}}>
      {children}
    </ToggleContext.Provider>
  );
};
