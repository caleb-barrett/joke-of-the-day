export interface Joke {
  id: string;
  /** The whole joke, or the setup when the joke has a separate delivery. */
  text: string;
  /** Punchline of a two-part joke, shown separately from the setup. */
  delivery?: string;
  source: string;
}

/** API exposed to the renderer as `window.jokeApi` by the preload script. */
export interface JokeApi {
  getJoke(): Promise<Joke>;
  closePopup(): void;
}
