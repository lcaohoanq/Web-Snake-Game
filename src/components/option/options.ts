import { modesList } from '../../schemas/options.models';
import { playIntroSound } from '../../util/game/soundEffects';

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/templates/options.html') {
    playIntroSound()
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error('Error playing intro sound:', error);
      });
  }

  const mode = document.querySelectorAll('.input')!;

  mode.forEach((block) => {
    block.addEventListener('click', () => {
      for (const mode of modesList) {
        if (block.innerHTML === mode.name) {
          window.location.href = mode.direct;
        }
      }
    });
  });
});
