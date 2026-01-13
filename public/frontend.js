const signinForm = document.querySelector('form');
const usernameError = document.querySelector('.username.error');
const passwordError = document.querySelector('.password.error');

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    usernameError.textContent = '';
    passwordError.textContent = '';

    const username = signinForm.username.value;
    const password = signinForm.password.value;

    

});