import type { Joke } from '@/shared/types';

/**
 * The single seam for joke content. The API work item replaces this body with a
 * `fetch` call (runs in the main process, so no CORS/CSP changes are needed).
 * On failure it should throw; the renderer already catches and shows a fallback.
 */
export async function getJoke(): Promise<Joke> {
  return {
    id: 'placeholder',
    text: 'Joke goes here — API integration pending.',
    source: 'placeholder',
  };
}
