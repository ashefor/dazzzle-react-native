import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers, prefetchImages, UserCard } from "@/components/folder/api";

const HIGH_WATER = 8;
const LOW_WATER = 3;
const PREFETCH_COUNT = 6;

type UsersFeedState = {
  queue: UserCard[];
  pending: UserCard[];
  loadingInitial: boolean;
  errorInitial: string | null;
};

export function useUsersFeed() {
  const [state, setState] = useState<UsersFeedState>({
    queue: [],
    pending: [],
    loadingInitial: true,
    errorInitial: null,
  });

  // Refs to track status without triggering re-renders
  const initializedRef = useRef(false);
  const prefetchingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // 1. PREFETCH NEXT BATCH (Appends to 'pending', never replaces 'queue')
  const prefetchNextBatch = useCallback(async () => {
    if (prefetchingRef.current) return;
    prefetchingRef.current = true;

    try {
      const users = await fetchUsers(abortRef.current?.signal);
      // Optimistically prefetch images
      prefetchImages(users.slice(0, PREFETCH_COUNT).map((u) => u.profileImage)).catch(() => {});

      setState((s) => {
        // Helper to avoid duplicates if API returns same IDs
        const currentIds = new Set([...s.queue, ...s.pending].map((u) => u.id));
        const newUnique = users.filter((u) => !currentIds.has(u.id));
        
        return { ...s, pending: [...s.pending, ...newUnique] };
      });
    } catch (err) {
      // Silent fail on background prefetch
      console.log("Background fetch failed", err);
    } finally {
      prefetchingRef.current = false;
    }
  }, []);

  // 2. INITIAL LOAD (Runs ONCE on mount)
  useEffect(() => {
    if (initializedRef.current) return; // Prevent double-init in React.StrictMode
    initializedRef.current = true;

    const loadInitial = async () => {
      abortRef.current = new AbortController();
      try {
        const users = await fetchUsers(abortRef.current.signal);
        prefetchImages(users.slice(0, PREFETCH_COUNT).map((u) => u.profileImage)).catch(() => {});
        
        setState((s) => ({
          ...s,
          queue: users, // Only time we REPLACE the queue is startup
          loadingInitial: false,
          errorInitial: null,
        }));
        
        // Immediately start buffering the next batch
        prefetchNextBatch();
      } catch (e: any) {
        setState((s) => ({
          ...s,
          loadingInitial: false,
          errorInitial: e?.message ?? "Failed loading users",
        }));
      }
    };

    loadInitial();

    return () => {
      abortRef.current?.abort();
    };
  }, [prefetchNextBatch]);

  // 3. APPEND PENDING (Moves cards from 'pending' to 'queue' instantly)
  const appendPendingIfNeeded = useCallback(() => {
    setState((s) => {
      // Only append if queue is getting low and we have backup
      if (s.queue.length <= LOW_WATER && s.pending.length > 0) {
        const nextQueue = [...s.queue, ...s.pending];
        // Trigger another prefetch since we just used our buffer
        setTimeout(() => prefetchNextBatch(), 0); 
        return { ...s, queue: nextQueue, pending: [] };
      }
      return s;
    });
  }, [prefetchNextBatch]);

  // 4. ENSURE BUFFER (Checks if we need more data)
  const ensurePrefetch = useCallback(() => {
    setState((s) => {
      if (s.queue.length <= HIGH_WATER && s.pending.length === 0) {
        setTimeout(() => prefetchNextBatch(), 0);
      }
      return s;
    });
  }, [prefetchNextBatch]);

  // 5. POP TOP (User action)
  const popTop = useCallback(() => {
    setState((s) => {
      const [, ...rest] = s.queue;
      return { ...s, queue: rest };
    });
    // After removing a card, check if we need to refill from pending
    appendPendingIfNeeded();
    ensurePrefetch();
  }, [appendPendingIfNeeded, ensurePrefetch]);

  // Memoize return values to prevent parent re-renders
  const topCard = state.queue[0];
  const nextCards = useMemo(() => state.queue.slice(1, 4), [state.queue]);

  return {
    topCard,
    nextCards,
    queueLength: state.queue.length,
    loadingInitial: state.loadingInitial,
    errorInitial: state.errorInitial,
    popTop,
    prefetchNextBatch,
  };
}