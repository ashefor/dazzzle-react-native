# React Doctor — known false positives

Each entry cites the shape the rule's own validation prompt names as a false
positive. Re-verify the code shape before suppressing a new occurrence.

## `no-fetch-in-effect` — app/onboard/location.tsx

The Places autocomplete effect is a one-shot `fetch` with a debounce and full
`AbortController` cleanup, in a project that has not adopted a data-fetching
library. The rule's validation prompt names exactly this shape as a false
positive. Installing react-query/SWR for this single search box is not
warranted; revisit if the app adopts one.

## `rn-no-scrollview-mapped-list` — app/onboard/location.tsx

The Google Places autocomplete API returns at most 5 predictions, so the mapped
list is a short fixed-length array — the rule's stated false positive ("under
about ten rows"). A `FlatList` here would also nest a VirtualizedList inside the
surrounding `KeyboardAwareScrollView`, which is the reason the previous
implementation was reverted to a `ScrollView` (see git history).

## `no-multi-comp` — components/CountryCodePicker.tsx

`renderBackdrop`, `ItemSeparator`, and `ListEmpty` are private implementation
details of the single exported component, hoisted to module scope specifically
so `BottomSheetFlatList` doesn't remount them on every render. This is the
rule's stated false positive: "a cohesive feature file whose private helper
components ... are genuinely implementation details of the one exported
component." Inlining them back to satisfy the rule would reintroduce the
remount it exists to prevent.
