import Swal from 'sweetalert2';
import { AccountType } from '../../schemas/account.model';
import { FormData } from '../../schemas/validForm';
import { getAccounts } from '../../util/account';
import { clearMsg, isRequired, isSame, isValid, max, min } from '../../util/formValidate';
document.addEventListener('DOMContentLoaded', () => {
  const formRegister = document.querySelector('#registerForm')! as HTMLFormElement;

  formRegister.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMsg();

    const usernameNode = document.querySelector('#username-register')! as HTMLInputElement;
    const passwordNode = document.querySelector('#password-register')! as HTMLInputElement;
    const confirmPasswordNode = document.querySelector('#confirmPassword')! as HTMLInputElement;
    const tickBoxNode = document.querySelector('#tickBox')! as HTMLInputElement;

    const errorMsg = [
      isValid(
        new FormData(usernameNode.value, [isRequired], usernameNode.parentElement!, [usernameNode])
      ),
      isValid(
        new FormData(
          passwordNode.value,
          [isRequired, min(8), max(30)],
          passwordNode.parentElement!,
          [passwordNode]
        )
      ),
      isValid(
        new FormData(
          confirmPasswordNode.value,
          [
            isRequired,
            min(8),
            max(30),
            isSame(passwordNode.value, 'password', 'confirmed-password')
          ],
          confirmPasswordNode.parentElement!,
          [confirmPasswordNode]
        )
      ),
      isValid(
        new FormData(tickBoxNode.checked, [isRequired], tickBoxNode.parentElement!, [tickBoxNode])
      )
    ];

    const isValidForm = errorMsg.every((item) => !item);

    const username = usernameNode.value;
    const password = passwordNode.value;
    const confirmPassword = confirmPasswordNode.value;

    if (isValidForm) {
      clearMsg();
      if (isMatch(password, confirmPassword)) {
        handleRegister(username, password).catch((error) => {
          console.error('Error registering:', error);
        });
      } else {
        Swal.fire({
          title: 'Register failed!',
          text: 'Password and Confirm Password do not match',
          icon: 'warning',
          confirmButtonText: 'Try again',
          heightAuto: false,
          scrollbarPadding: false
        });
      }
    }
  });
});

function isMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

async function handleRegister(username: string, password: string): Promise<void> {
  try {
    const accountList = getAccounts();
    const account = accountList.find((acc) => acc.username === username);

    if (account) {
      throw new Error('Username already exists!');
    } else {
      const newAccount: AccountType = {
        username,
        password,
        score: 0
      };
      accountList.push(newAccount);
      localStorage.setItem('accounts', JSON.stringify(accountList));

      await Swal.fire({
        title: 'Register success!',
        text: 'Login now to continue',
        icon: 'success',
        confirmButtonText: 'Continue',
        heightAuto: false,
        scrollbarPadding: false
      }).then((result) => {
        if (result.isConfirmed) {
          return;
        }
        throw new Error('Confirmation not received.');
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      await Swal.fire({
        title: 'Register failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try again',
        heightAuto: false,
        scrollbarPadding: false
      });
    }
  }
}
