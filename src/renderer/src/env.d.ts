import type { JokeApi } from '@/shared/types';

declare global {
  interface Window {
    jokeApi: JokeApi;
  }
}

export {};
