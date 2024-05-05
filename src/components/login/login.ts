import Swal from 'sweetalert2';
import { LoginFormModel } from '../../models/login.model';
import { FormData } from '../../models/validForm';
import { clearMsg, isRequired, isValid, isValidForm } from '../../util/formValidate';

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.querySelector('#loginForm')! as HTMLFormElement;

  formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMsg();

    const usernameNode = document.querySelector('#username-login')! as HTMLInputElement;
    const passwordNode = document.querySelector('#password-login')! as HTMLInputElement;

    const user = new LoginFormModel({
      username: usernameNode.value,
      password: passwordNode.value
    });

    if (isValidForm(usernameNode, passwordNode)) {
      clearMsg();
      handleLogin(user.getUsername, user.getPassword);
    }
  });
});

async function handleLogin(username: string, password: string) {
  try {
    const response = (await login(username, password)) as any;
    if (response) {
      console.log(response);
      Swal.fire({
        title: 'Login success!',
        icon: 'success',
        confirmButtonText: 'Continue',
        heightAuto: false, // prevent auto scroll
        scrollbarPadding: false // prevent scrollbar changes
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/templates/options.html';
        }
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Login failed!',
      text: error,
      icon: 'error',
      confirmButtonText: 'Try again',
      heightAuto: false,
      scrollbarPadding: false
    });
  }
}

async function login(username: string, password: string) {
  try {
    const response = await fetch('https://web-snake-game-backend.onrender.com/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const status = response.status;

    if (status === 400) {
      throw new Error('Wrong username or password!');
    } else if (status == 500) {
      throw new Error('Server error!');
    }

    // reach here we receive a status 200
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
