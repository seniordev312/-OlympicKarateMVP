import {useEffect, useRef, useState} from 'react';

export function useFetch<T>(
  initialState: T,
  fetchFn: () => Promise<T>,
  deps?: any[],
) {
  const [data, setData] = useState<T>(initialState);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const newData = await fetchFn();
        if (isMounted.current) {
          setData(newData);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err);
        setData(initialState);
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [...deps]);

  // When the data is fetched and set, loading is set to false
  useEffect(() => {
    data && setLoading(false);
  }, [data]);

  return {data, setData, error, loading};
}
