/** Requests a right-sized source from the Unsplash CDN before Next.js optimises it. */
export function photo(url: string, width = 1600) {
  return `${url}?auto=format&fit=crop&w=${width}&q=70`;
}
