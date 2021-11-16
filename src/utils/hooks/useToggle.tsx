import {useState} from 'react';

export type Toggle = {
  state: boolean;
  toggle: () => void;
  setOn: () => void;
  setOff: () => void;
};
export const useToggle: (initialState: boolean) => Toggle = (
  initialState: boolean,
) => {
  const [state, setState] = useState(initialState);

  const toggle = () => {
    setState(!state);
  };

  const setOn = () => setState(true);
  const setOff = () => setState(false);

  return {state, toggle, setOn, setOff};
};
