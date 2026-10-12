const jokeText = document.getElementById('joke-text');
const closeButton = document.getElementById('close-button');

closeButton?.addEventListener('click', () => window.jokeApi.closePopup());

async function showJoke(): Promise<void> {
  if (!jokeText) {
    return;
  }
  try {
    const joke = await window.jokeApi.getJoke();
    jokeText.textContent = joke.text;
  } catch {
    jokeText.textContent = 'Could not load joke.';
  }
}

void showJoke();
