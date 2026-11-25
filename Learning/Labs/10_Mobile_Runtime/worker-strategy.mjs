
export async function cacheFixture(cache, request, get = fetch) {
  const stored = await cache.match(request);
  if (stored) return stored;

  const response = await get(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}
