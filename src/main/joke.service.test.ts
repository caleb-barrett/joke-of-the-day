import { afterEach, describe, expect, it, vi } from 'vitest';

import { getJoke } from '@/main/joke.service';

const URL = 'https://v2.jokeapi.dev/joke/Programming?format=xml&safe-mode';

const TWOPART_XML = `<?xml version='1.0'?>
<data>
    <error>false</error>
    <category>Programming</category>
    <type>twopart</type>
    <setup>Why did the programmer quit his job?</setup>
    <delivery>Because he didn't get arrays.</delivery>
    <flags><nsfw>false</nsfw></flags>
    <id>16</id>
    <safe>true</safe>
    <lang>en</lang>
</data>`;

function stubFetch(body: string, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getJoke', () => {
  it('maps a twopart joke and calls the API with a timeout signal', async () => {
    const fetchMock = stubFetch(TWOPART_XML);

    await expect(getJoke()).resolves.toEqual({
      id: '16',
      text: 'Why did the programmer quit his job?',
      delivery: "Because he didn't get arrays.",
      source: 'jokeapi.dev',
    });
    expect(fetchMock).toHaveBeenCalledWith(URL, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it('maps a single joke and decodes XML entities', async () => {
    stubFetch(
      `<data><error>false</error><type>single</type><joke>Tom &amp; Jerry &quot;debug&quot; &#39;code&#39;</joke><id>7</id></data>`,
    );

    await expect(getJoke()).resolves.toEqual({
      id: '7',
      text: `Tom & Jerry "debug" 'code'`,
      source: 'jokeapi.dev',
    });
  });

  it('rejects when the API reports an error', async () => {
    stubFetch(`<data><error>true</error><message>No matching joke found</message></data>`);
    await expect(getJoke()).rejects.toThrow(/No matching joke found/);
  });

  it('rejects on an HTTP error status', async () => {
    stubFetch('oops', 500);
    await expect(getJoke()).rejects.toThrow(/HTTP 500/);
  });

  it('rejects when the request times out or the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('timed out', 'TimeoutError')));
    await expect(getJoke()).rejects.toThrow('timed out');
  });

  it('rejects a twopart joke with no delivery', async () => {
    stubFetch('<data><error>false</error><type>twopart</type><setup>Knock knock</setup><id>3</id></data>');
    await expect(getJoke()).rejects.toThrow(/unexpected response/);
  });

  it('rejects on a malformed response', async () => {
    stubFetch('<data><error>false</error></data>');
    await expect(getJoke()).rejects.toThrow(/unexpected response/);
  });
});
