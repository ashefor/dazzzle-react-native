// Lightweight API client with cancellation support and prefetch helpers

import axiosRequest from "@/utils/axios";
import { Image } from "react-native";

let prefetchDisabled = false;

export type UserCard = {
  countryName: string
  coverImage: string
  detailString: string
  dob: string
  fullName: string
  gender: string
  id: number
  isPremiumUser: boolean
  profileImage: string
  userAge: number
  userOnlineStatus: number
  username: string
};

type FetchUsersParams = {
  cursor?: string | null;
  limit?: number;
  signal?: AbortSignal;
};


export async function fetchUsers(signal?: AbortSignal): Promise<UserCard[]> {
  const res = await axiosRequest.profiles.get({ signal });
  const data = res.data;

  // Normalize to an array. Supports either raw array or { users: [...] } shapes.
  const users: unknown =
    Array.isArray(data) ? data : (data && (data.filterData ?? []));

  if (!Array.isArray(users)) return [];
  console.log('Fetched users:', users);
  return users
}

export async function sendSwipe({
  userId,
  direction, // "left" | "right"
}: {
  userId: string;
  direction: "left" | "right";
}): Promise<void> {
    const directionValue = direction === "right" ? '1' : '0';
    const res = await axiosRequest.post(`/${userId}/${directionValue}/user-like-dislike`, {});
    return res.data;
}

export async function prefetchImages(urls: string[], concurrency = 4): Promise<void> {
  if (prefetchDisabled) return;
  const unique = Array.from(new Set(urls)).filter(Boolean);
  if (unique.length === 0) return;

  const queue = [...unique];
  const workers: Promise<void>[] = [];

  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      if (!url) continue;
      try {
        await Image.prefetch(url);
      } catch (err: any) {
        const msg = String(err?.message || "");
        // Detect the invariant violation and disable further prefetch attempts.
        if (msg.includes("NativeEventEmitter") && msg.includes("non-null")) {
          prefetchDisabled = true;
          return; // abort this worker; others may still finish gracefully
        }
        // Ignore other failures (404, network, etc.)
      }
    }
  }

  const actualConcurrency = Math.min(concurrency, unique.length);
  for (let i = 0; i < actualConcurrency; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
}