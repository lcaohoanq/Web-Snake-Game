import { darkThemePath, lightThemePath } from '../constants/file.path';

export function changeTheme(): void {
  const toggle = document.querySelector('#toggle')! as HTMLInputElement;
  let bodyId;
  if (toggle.checked) {
    bodyId = 'light';
    console.log(lightThemePath);
  } else {
    bodyId = 'dark';
    console.log(darkThemePath);
  }
  document.body.id = bodyId;
}

// Set the initial theme based on the current time
export function setInitialTheme(): void {
  const currentTime = new Date().getHours();
  // Check if it's daytime (6:00 to 18:00)
  if (currentTime >= 6 && currentTime < 18) {
    document.body.id = 'light';
  } else {
    document.body.id = 'dark';
  }
}
