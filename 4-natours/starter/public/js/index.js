// !@MAIN FILE

import '@babel/polyfill'; // a package that makes new features of JS to work in old browsers
import { login } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');

// VALUES

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });
