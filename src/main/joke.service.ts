import type { Joke } from '@/shared/types';

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Programming?format=xml&safe-mode';
const JOKE_TIMEOUT_MS = 5_000;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeXml(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, e: string) =>
    e[0] === '#'
      ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
      : ENTITIES[e.toLowerCase()],
  );
}

function tag(xml: string, name: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decodeXml(m[1].trim()) : undefined;
}

/**
 * Fetches a joke from JokeAPI (runs in the main process, so no CORS/CSP changes are needed).
 * Throws on any failure; the renderer catches and shows a fallback.
 */
export async function getJoke(): Promise<Joke> {
  const res = await fetch(JOKE_API_URL, { signal: AbortSignal.timeout(JOKE_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Joke API HTTP ${res.status}`);
  const xml = await res.text();

  if (tag(xml, 'error') === 'true') throw new Error(`Joke API error: ${tag(xml, 'message') ?? 'unknown'}`);

  const id = tag(xml, 'id');
  const twopart = tag(xml, 'type') === 'twopart';
  const text = twopart ? tag(xml, 'setup') : tag(xml, 'joke');
  const delivery = twopart ? tag(xml, 'delivery') : undefined;
  if (!id || !text || (twopart && !delivery)) throw new Error('Joke API returned an unexpected response');

  return twopart ? { id, text, delivery, source: 'jokeapi.dev' } : { id, text, source: 'jokeapi.dev' };
}
