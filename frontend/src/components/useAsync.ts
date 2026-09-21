import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';

/** Muat data async saat mount, dengan state loading/error dan reload manual. */
export function useAsync<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return fn()
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [fn]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}
