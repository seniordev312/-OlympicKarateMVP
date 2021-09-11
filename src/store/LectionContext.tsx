import {Lection} from '@models';
import {useGetLectionsData} from '@services/api';
import {Endpoints, RoutePlaceholders} from '@services/api/types';
import {UserContext} from '@store';
import React, {createContext, FC, useContext} from 'react';

export type LectionContext = {
  lections: Lection[];
  loading: boolean;
};

export const LectionContext = createContext<LectionContext>({
  lections: [],
  loading: true,
});

export const LectionContextProvider: FC<{courseId: string}> = ({
  courseId,
  children,
}) => {
  const {user} = useContext(UserContext);
  const {data, loading} = useGetLectionsData(
    Endpoints.lections.replace(RoutePlaceholders.COURSE_ID, courseId),
    {
      headers: {Authorization: `Bearer ${user.token ?? ''}`},
      params: {courseId},
    },
    [courseId, user.token],
    !!courseId && !!user.token,
  );

  return (
    <LectionContext.Provider value={{lections: data?.lections ?? [], loading}}>
      {children}
    </LectionContext.Provider>
  );
};
