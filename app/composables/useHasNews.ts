/** True when the Bacheca has at least one post: until then it stays out of the navigation. */
export function useHasNews() {
  const { data } = useAsyncData('bacheca-count', () => queryCollection('bacheca').count(), { default: () => 0 })
  return computed(() => data.value > 0)
}
