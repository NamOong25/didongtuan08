
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../store';
import { setQuantity } from '../store/cartSlice';

export function useDebouncedQuantities() {
  const dispatch = useAppDispatch();
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pending = useRef<Record<string, number>>({});

  const commit = useCallback((id: string) => {
    const quantity = pending.current[id];
    if (quantity === undefined) return;

    dispatch(setQuantity({ id, quantity }));
    delete pending.current[id];
    delete timers.current[id];

    setDrafts(old => {
      const next = { ...old };
      delete next[id];
      return next;
    });
  }, [dispatch]);

  const changeQuantity = (id: string, quantity: number) => {
    pending.current[id] = quantity;
    setDrafts(old => ({ ...old, [id]: quantity }));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => commit(id), 300);
  };

  const discard = (id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    delete pending.current[id];
    setDrafts(old => {
      const next = { ...old };
      delete next[id];
      return next;
    });
  };

  const flush = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    Object.entries(pending.current).forEach(([id, quantity]) => {
      dispatch(setQuantity({ id, quantity }));
    });
    timers.current = {};
    pending.current = {};
    setDrafts({});
  }, [dispatch]);

  useEffect(() => () => {
    Object.values(timers.current).forEach(clearTimeout);
    Object.entries(pending.current).forEach(([id, quantity]) => {
      dispatch(setQuantity({ id, quantity }));
    });
  }, [dispatch]);

  return { drafts, changeQuantity, discard, flush };
}
