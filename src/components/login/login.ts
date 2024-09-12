import Swal from 'sweetalert2';
import { FormData } from '../../schemas/validForm';
import { getAccounts } from '../../util/account';
import { clearMsg, isRequired, isValid } from '../../util/formValidate';
import { LoginFormModel } from '../../models/login.model';

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.querySelector('#loginForm')! as HTMLFormElement;

  formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMsg();

    const usernameNode = document.querySelector('#username-login')! as HTMLInputElement;
    const passwordNode = document.querySelector('#password-login')! as HTMLInputElement;

    const errorMsg = [
      isValid(
        new FormData(usernameNode.value, [isRequired], usernameNode.parentElement!, [usernameNode])
      ),
      isValid(
        new FormData(passwordNode.value, [isRequired], passwordNode.parentElement!, [passwordNode])
      )
    ];

    const isValidForm = errorMsg.every((item) => !item);

    const user = new LoginFormModel({
      username: usernameNode.value,
      password: passwordNode.value
    });

    if (isValidForm) {
      clearMsg();
      handleLogin(user.getUsername, user.getPassword).catch((error) => {
        console.error('Error logging in:', error);
      });
    }
  });
});

async function handleLogin(username: string, password: string): Promise<void> {
  try {
    const accountsList = getAccounts();
    const account = accountsList.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      await Swal.fire({
        title: 'Login success!',
        text: 'Hi, ' + username + '!',
        icon: 'success',
        confirmButtonText: 'Continue',
        heightAuto: false,
        scrollbarPadding: false
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/templates/options.html';
          return;
        }
        throw new Error('Confirmation not received.');
      });
    } else {
      throw new Error('Invalid username or password!');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      await Swal.fire({
        title: 'Login failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try again',
        heightAuto: false,
        scrollbarPadding: false
      });
    }
  }
}
