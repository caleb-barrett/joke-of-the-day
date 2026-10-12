export interface Joke {
  id: string;
  text: string;
  source: string;
}

/** API exposed to the renderer as `window.jokeApi` by the preload script. */
export interface JokeApi {
  getJoke(): Promise<Joke>;
  closePopup(): void;
}
