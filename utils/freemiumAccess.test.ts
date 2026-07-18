import {
  FREEMIUM_ACCESS_END,
  FREEMIUM_ACCESS_START,
  isFreemiumAccessActive,
} from './freemiumAccess';

describe('isFreemiumAccessActive', () => {
  it('starts at midnight WAT on July 18', () => {
    expect(isFreemiumAccessActive(new Date(FREEMIUM_ACCESS_START.getTime() - 1))).toBe(false);
    expect(isFreemiumAccessActive(FREEMIUM_ACCESS_START)).toBe(true);
  });

  it('includes all of August 20 in WAT', () => {
    expect(isFreemiumAccessActive(new Date('2026-08-20T23:59:59.999+01:00'))).toBe(true);
  });

  it('ends at midnight WAT on August 21', () => {
    expect(isFreemiumAccessActive(FREEMIUM_ACCESS_END)).toBe(false);
  });
});
