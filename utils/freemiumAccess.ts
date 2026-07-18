// The promotion runs in Dazzzle's Nigeria business timezone (WAT, UTC+1).
// The end is exclusive so users retain access for all of August 20, 2026.
export const FREEMIUM_ACCESS_START = new Date('2026-07-18T00:00:00+01:00');
export const FREEMIUM_ACCESS_END = new Date('2026-08-21T00:00:00+01:00');

export const isFreemiumAccessActive = (now: Date = new Date()): boolean => {
  const timestamp = now.getTime();

  return (
    timestamp >= FREEMIUM_ACCESS_START.getTime() &&
    timestamp < FREEMIUM_ACCESS_END.getTime()
  );
};
