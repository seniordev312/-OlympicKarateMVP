import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';

export const useClearOnBlur = (id: string, clearErrors: () => void) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      return;
    }

    clearErrors();
  }, [clearErrors, id, isFocused]);
};
