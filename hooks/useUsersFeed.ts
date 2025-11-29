import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers, prefetchImages, UserCard } from "@/components/folder/api";

// Tunables:
// - HIGH_WATER: when queue length falls below this, begin background prefetch.
// - LOW_WATER: when queue length falls below this, append pending immediately.
const BATCH_SIZE = 12;
const HIGH_WATER = 8;
const LOW_WATER = 3;
const PREFETCH_COUNT = 6;

type UsersFeedState = {
  queue: UserCard[];
  pending: UserCard[];      // pre-fetched batch ready to append
  loadingInitial: boolean;  // only for app entry
  errorInitial: string | null;
};

export function useUsersFeed() {
  const [state, setState] = useState<UsersFeedState>({
    queue: [],
    pending: [],
    loadingInitial: true,
    errorInitial: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const prefetchingRef = useRef(false); // avoids overlapping prefetch calls

  // Initial load: show loader only if no data yet
  const initialLoad = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const users = await fetchUsers(abortRef.current.signal);
      // Prefetch a few images

      prefetchImages(users.slice(0, PREFETCH_COUNT).map(u => u.profileImage)).catch(() => {});

      setState({
        queue: users,
        pending: [],
        loadingInitial: false,
        errorInitial: null,
      });
      // Immediately prefetch a pending batch in background
      void prefetchNextBatch();
    } catch (e: any) {
      setState((s) => ({
        ...s,
        loadingInitial: false,
        errorInitial: e?.message ?? "Failed loading users",
      }));
    }
  }, []);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const prefetchNextBatch = useCallback(async () => {
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;
    try {
      const users = await fetchUsers(abortRef.current?.signal);
      // Prefetch images for smoother rendering
      prefetchImages(users.slice(0, PREFETCH_COUNT).map((u) => u.profileImage)).catch(() => {});
      setState((s) => ({ ...s, pending: users }));
    } catch {
      // Keep pending empty on failure; UI stays with current queue
      setState((s) => ({ ...s, pending: [] }));
    } finally {
      prefetchingRef.current = false;
    }
  }, []);

  const appendPendingIfNeeded = useCallback(() => {
    setState((s) => {
      // If queue is low and we have a pending batch, append instantly.
      if (s.queue.length <= LOW_WATER && s.pending.length > 0) {
        const nextQueue = [...s.queue, ...s.pending];
        // After append, kick off another prefetch for the next pending batch.
        void prefetchNextBatch();
        return { ...s, queue: nextQueue, pending: [] };
      }
      return s;
    });
  }, [prefetchNextBatch]);

  const ensurePrefetch = useCallback(() => {
    setState((s) => {
      // If queue is below high-water mark and no pending batch is ready, prefetch.
      if (s.queue.length <= HIGH_WATER && s.pending.length === 0 && !prefetchingRef.current) {
        void prefetchNextBatch();
      }
      return s;
    });
  }, [prefetchNextBatch]);

  // When the user swipes away the top card
  const popTop = useCallback(() => {
    setState((s) => {
      const [, ...rest] = s.queue;
      return { ...s, queue: rest };
    });
    // Try to append pending if queue is low, otherwise ensure prefetch continues
    appendPendingIfNeeded();
    ensurePrefetch();
  }, [appendPendingIfNeeded, ensurePrefetch]);

  const pushBack = useCallback((card: UserCard) => {
    setState((s) => ({ ...s, queue: [...s.queue, card] }));
  }, []);

  const topCard = useMemo(() => state.queue[0], [state.queue]);
  const nextCards = useMemo(() => state.queue.slice(1, 4), [state.queue]);

  return {
    topCard,
    nextCards,
    queueLength: state.queue.length,
    loadingInitial: state.loadingInitial,
    errorInitial: state.errorInitial,

    popTop,
    pushBack,

    // Expose for manual refresh if you want a pull-to-refresh later
    prefetchNextBatch,
  };
}