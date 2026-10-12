import { describe, expect, it } from 'vitest';

import { getJoke } from '@/main/joke.service';

describe('getJoke', () => {
  it('resolves a joke with non-empty id, text and source', async () => {
    const joke = await getJoke();
    expect(joke.id).not.toBe('');
    expect(joke.text).not.toBe('');
    expect(joke.source).not.toBe('');
  });
});
